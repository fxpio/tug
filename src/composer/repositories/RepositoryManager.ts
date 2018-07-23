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
import MessageQueue from '../../queues/MessageQueue';
import RepositoryNotSupportedError from '../../errors/RepositoryNotSupportedError';
import RepositoryNotFoundError from '../../errors/RepositoryNotFoundError';
import VcsDriverNotFoundError from '../../errors/VcsDriverNotFoundError';
import {LooseObject} from '../../utils/LooseObject';
import {retrieveAllRepositories} from '../../utils/repository';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RepositoryManager
{
    private readonly configManager: ConfigManager;
    private readonly codeRepoRepo: CodeRepositoryRepository;
    private readonly queue: MessageQueue;

    private cacheRepositories: LooseObject;
    private cacheUrlPackages: LooseObject;
    private allRepoRetrieves: boolean;

    /**
     * Constructor.
     *
     * @param {ConfigManager}            configManager The config
     * @param {CodeRepositoryRepository} codeRepoRepo  The database repository of code repository
     * @param {MessageQueue}             queue         The message queue
     */
    constructor(configManager: ConfigManager, codeRepoRepo: CodeRepositoryRepository, queue: MessageQueue) {
        this.configManager = configManager;
        this.codeRepoRepo = codeRepoRepo;
        this.queue = queue;
        this.cacheRepositories = {};
        this.cacheUrlPackages = {};
        this.allRepoRetrieves = false;
    }

    /**
     * Clear the cache of manager.
     */
    public clearCache(): void {
        this.cacheRepositories = {};
        this.cacheUrlPackages = {};
    }

    /**
     * Register the repository.
     *
     * @param {string} url    The repository url
     * @param {string} [type] The vcs type
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    public async register(url: string, type?: string): Promise<VcsRepository> {
        let repo = await this.createVcsRepository(url, type);
        let existingRepo = await this.getRepository(repo.getUrl());

        if (!existingRepo) {
            await this.update(repo);
            await this.queue.send({type: 'refresh-packages', repositoryUrl: repo.getUrl()});

            return repo;
        }

        return existingRepo;
    }

    /**
     * Unregister the repository.
     *
     * @param {string} url The repository url
     *
     * @return {Promise<string>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    public async unregister(url: string): Promise<string> {
        let repo = await this.createVcsRepository(url);
        let existingRepo = await this.getRepository(repo.getUrl());

        if (existingRepo) {
            url = existingRepo.getUrl();
            await this.delete(existingRepo);

            if (existingRepo.getPackageName()) {
                await this.queue.send({type: 'delete-packages', packageName: existingRepo.getPackageName()});
            }
        }

        return url;
    }

    /**
     * Find a vcs repository for a package name.
     *
     * @param {string} packageName The package name
     *
     * @return {Promise<VcsRepository|null>}
     */
    public async findRepository(packageName: string): Promise<VcsRepository|null> {
        if (this.cacheRepositories[packageName]) {
            return this.cacheRepositories[packageName];
        }

        let repoData = await this.codeRepoRepo.findOne({packageName: packageName});

        if (repoData) {
            let repo = new VcsRepository(repoData, await this.configManager.get());
            this.cacheRepositories[repo.getPackageName() as string] = repo;

            return repo;
        }

        return null;
    }

    /**
     * Get the repository.
     *
     * @param {string}  url        The repository url
     * @param {boolean} [required] Check if the repository is required
     *
     * @return {Promise<VcsRepository|null>}
     *
     * @throws RepositoryNotFoundError When the repository is not found and it is required
     */
    public async getRepository(url: string, required: boolean = false): Promise<VcsRepository|null> {
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
     * @param {string}   url    The repository url
     * @param {boolean} [force] Force the initialization
     *
     * @return {Promise<VcsRepository|null>}
     */
    public async getAndInitRepository(url: string, force: boolean = false): Promise<VcsRepository|null> {
        let repo = await this.getRepository(url);

        if (repo && await this.initRepository(repo, force)) {
            return repo;
        }

        return null;
    }

    /**
     * Get all initialized vcs repositories.
     *
     * @param {boolean} forceAll Check if all repositories must be returned
     *                           or only returns the initialized repositories
     *
     * @return {Promise<LooseObject<string, VcsRepository>>}
     */
    public async getRepositories(forceAll:boolean = false): Promise<LooseObject> {
        let res = this.cacheRepositories;

        if ((!this.allRepoRetrieves && forceAll) || !forceAll) {
            let config = await this.configManager.get();
            res = await retrieveAllRepositories(config, this.codeRepoRepo, forceAll ? res : {}, forceAll);

            if (forceAll) {
                this.allRepoRetrieves = true;
                this.cacheRepositories = res;
            }
        }

        return res;
    }

    /**
     * Update the repository.
     *
     * @param {VcsRepository} repository The repository
     *
     * @return {Promise<void>}
     */
    public async update(repository: VcsRepository): Promise<void> {
        await this.codeRepoRepo.put(repository.getData());
    }

    /**
     * Delete the repository.
     *
     * @param {VcsRepository} repository The repository
     *
     * @return {Promise<void>}
     */
    public async delete(repository: VcsRepository): Promise<void> {
        await this.codeRepoRepo.delete(repository.getId());
    }

    /**
     * Initialize the repository.
     *
     * @param {VcsRepository} repository The vcs repository
     * @param {boolean}       [force]    Force the initialization
     *
     * @return {Promise<boolean>}
     */
    public async initRepository(repository: VcsRepository, force: boolean = false): Promise<boolean> {
        if (force || null === repository.getPackageName() || null === repository.getRootIdentifier()) {
            let driver = repository.getDriver();
            let rootIdentifier = await driver.getRootIdentifier();

            if (await driver.hasComposerFile(rootIdentifier)) {
                let composer: LooseObject = await driver.getComposerInformation(rootIdentifier) as LooseObject;
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
     * @param {string} url    The repository url
     * @param {string} [type] The vcs type
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    public async createVcsRepository(url: string, type?: string): Promise<VcsRepository> {
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
     * @param {string} url The repository url
     *
     * @return {Promise<string>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    public async validateUrl(url: string): Promise<string> {
        if (url) {
            url = (await this.createVcsRepository(url)).getUrl();
        }

        return url;
    }
}
