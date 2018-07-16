/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CodeRepositoryRepository from '../../db/repositories/CodeRepositoryRepository';
import ConfigManager from '../../configs/ConfigManager';
import VcsRepository from './VcsRepository';
import RepositoryNotSupportedError from '../../errors/RepositoryNotSupportedError';
import RepositoryNotFoundError from '../../errors/RepositoryNotFoundError';
import VcsDriverNotFoundError from '../../errors/VcsDriverNotFoundError';
import {retrieveAllRepositories} from '../../utils/repository';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RepositoryManager
{
    /**
     * Constructor.
     *
     * @param {ConfigManager}            configManager The config
     * @param {CodeRepositoryRepository} codeRepoRepo  The database repository of code repository
     * @param {MessageQueue}             queue         The message queue
     */
    constructor(configManager, codeRepoRepo, queue) {
        this.configManager = configManager;
        this.codeRepoRepo = codeRepoRepo;
        this.queue = queue;
        this.cacheRepositories = {};
        this.cacheUrlPackages = {};
        this.allRepoRetrieves = false;
    }

    /**
     * Register the repository.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {VcsRepository}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    async register(url, type = null) {
        let repo = await this.createVcsRepository(url, type);
        let existingRepo = await this.getRepository(repo.getUrl());

        if (!existingRepo) {
            await this.update(repo);
            await this.queue.send({type: 'refresh-packages', repositoryUrl: repo.url});

            return repo;
        }

        return existingRepo;
    }

    /**
     * Unregister the repository.
     *
     * @param {String} url The repository url
     *
     * @return {String}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    async unregister(url) {
        let repo = await this.createVcsRepository(url);
        let existingRepo = await this.getRepository(repo.getUrl());

        if (existingRepo) {
            url = existingRepo.getUrl();
            await this.delete(existingRepo);
            await this.queue.send({type: 'delete-packages', repositoryUrl: url});
        }

        return url;
    }

    /**
     * Find a vcs repository for a package name.
     *
     * @param {String} packageName The package name
     *
     * @return {VcsRepository|null}
     */
    async findRepository(packageName) {
        if (this.cacheRepositories[packageName]) {
            return this.cacheRepositories[packageName];
        }

        let repoData = await this.codeRepoRepo.findOne({packageName: packageName});

        if (repoData) {
            let repo = new VcsRepository(repoData, await this.configManager.get());
            this.cacheRepositories[repo.getPackageName()] = repo;

            return repo;
        }

        return null;
    }

    /**
     * Get the repository.
     *
     * @param {String}  url        The repository url
     * @param {Boolean} [required] Check if the repository is required
     *
     * @return {Promise<VcsRepository|null>}
     *
     * @throws RepositoryNotFoundError When the repository is not found and it is required
     */
    async getRepository(url, required = false) {
        url = await this.validateUrl(url);
        let packageName = undefined !== this.cacheUrlPackages[url] ? this.cacheUrlPackages[url] : null;
        if (packageName && undefined !== this.cacheRepositories[packageName]) {
            return this.cacheRepositories[packageName];
        }

        let res = await this.codeRepoRepo.findOne({url: url});
        let repo = res ? new VcsRepository(res, await this.configManager.get()) : null;
        packageName = repo ? repo.getPackageName() : packageName;

        if (repo && packageName) {
            this.cacheUrlPackages[url] = packageName;
            this.cacheRepositories[packageName] = repo;
        }

        if (required && null === repo) {
            throw new RepositoryNotFoundError(`The repository with the url "${url}" is not found`);
        }

        return repo;
    }

    /**
     * Get the repository and initialize it if it is not the case.
     *
     * @param {String}   url    The repository url
     * @param {Boolean} [force] Force the initialization
     *
     * @return {Promise<VcsRepository|null>}
     */
    async getAndInitRepository(url, force = false) {
        let repo = await this.getRepository(url);

        if (repo && await this.initRepository(repo, force)) {
            return repo;
        }

        return null;
    }

    /**
     * Get all initialized vcs repositories.
     *
     * @param {Boolean} forceAll Check if all repositories must be returned
     *                           or only returns the initialized repositories
     *
     * @return {Object<String, VcsRepository>}
     */
    async getRepositories(forceAll = false) {
        if (!this.allRepoRetrieves) {
            this.allRepoRetrieves = true;
            let config = await this.configManager.get();
            this.cacheRepositories = retrieveAllRepositories(config, this.codeRepoRepo, this.cacheRepositories, forceAll);
        }

        return this.cacheRepositories;
    }

    /**
     * Update the repository.
     *
     * @param {VcsRepository} repository The repository
     */
    async update(repository) {
        await this.codeRepoRepo.put(repository.getData());
    }

    /**
     * Delete the repository.
     *
     * @param {VcsRepository} repository The repository
     */
    async delete(repository) {
        await this.codeRepoRepo.delete(repository.getId());
    }

    /**
     * Initialize the repository.
     *
     * @param {VcsRepository} repository The vcs repository
     * @param {Boolean}       [force]    Force the initialization
     *
     * @return {Promise<boolean>}
     */
    async initRepository(repository, force = false) {
        if (force || null === repository.getPackageName() || null === repository.getRootIdentifier()) {
            let driver = repository.getDriver();
            let rootIdentifier = await driver.getRootIdentifier();

            if (await driver.hasComposerFile(rootIdentifier)) {
                let composer = await driver.getComposerInformation(rootIdentifier);
                repository.setPackageName(composer['name']);
                repository.setRootIdentifier(rootIdentifier);
                await this.update(repository);
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * Create a vcs repository and validate the url and type.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    async createVcsRepository(url, type = null) {
        let config = await this.configManager.get();
        let repo = new VcsRepository({url: url, type: type}, config);

        try {
            repo.getDriver();
        } catch (e) {
            if (e instanceof VcsDriverNotFoundError) {
                throw new RepositoryNotSupportedError(`The repository with the URL "${url}" is not supported`);
            }
        }

        return repo;
    }

    /**
     * Validate and format the repository url.
     *
     * @param {String} url The repository url
     *
     * @return {Promise<String>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    async validateUrl(url) {
        return (await this.createVcsRepository(url)).getUrl();
    }
}
