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
import RepositoryNotSupportedError from './RepositoryNotSupportedError';
import RepositoryNotFoundError from './RepositoryNotFoundError';
import VcsDriverNotFoundError from './VcsDriverNotFoundError';
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
        this.allRepoRetrieves = false;
    }

    /**
     * Register the repository.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {VcsRepository}
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
     * Refresh the packages.
     *
     * @param {String}  url   The repository url
     * @param {Boolean} force Check if existing packages must be overridden
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotFoundError When the repository is not found
     */
    async refreshPackages(url, force = true) {
        let repo = await this.createVcsRepository(url);
        let existingRepo = await this.getRepository(repo.getUrl());

        if (!existingRepo) {
            throw new RepositoryNotFoundError(`The repository with the url "${repo.getUrl()}" is not found`);
        }

        await this.queue.send({type: 'refresh-packages', repositoryUrl: existingRepo.getUrl(), force: force});

        return existingRepo;
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
     * @param {String} url The repository url
     *
     * @return {Promise<VcsRepository|null>}
     */
    async getRepository(url) {
        let res = await this.codeRepoRepo.findOne({url: url});

        return res ? new VcsRepository(res, await this.configManager.get()) : null;
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
     * Create a vcs repository and validate the url and type.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {Promise<VcsRepository>}
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
}
