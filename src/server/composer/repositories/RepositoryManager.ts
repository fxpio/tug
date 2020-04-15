/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsRepository} from '@server/composer/repositories/VcsRepository';
import {ConfigManager} from '@server/configs/ConfigManager';
import {CodeRepositoryRepository} from '@server/db/repositories/CodeRepositoryRepository';
import {RepositoryNotFoundError} from '@server/errors/RepositoryNotFoundError';
import {RepositoryNotSupportedError} from '@server/errors/RepositoryNotSupportedError';
import {VcsRepositoryNotFoundError} from '@server/errors/VcsRepositoryNotFoundError';
import {MessageQueue} from '@server/queues/MessageQueue';
import {LooseObject} from '@server/utils/LooseObject';
import {retrieveAllRepositories} from '@server/utils/repository';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RepositoryManager
{
    private readonly configManager: ConfigManager;
    private readonly codeRepoRepo: CodeRepositoryRepository;
    private readonly queue: MessageQueue;

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
    }

    /**
     * Clear the cache of manager.
     *
     * @param {Response} [res] The response
     */
    public static clearCache(res?: Response): void {
        if (res) {
            delete res.locals.cacheRepositories;
            delete res.locals.cacheUrlPackages;
            delete res.locals.allRepoRetrieves;
        }
    }

    /**
     * Register the repository.
     *
     * @param {string}   url    The repository url
     * @param {string}   [type] The vcs type
     * @param {Response} [res]  The response
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    public async register(url: string, type?: string, res?: Response): Promise<VcsRepository> {
        let repo = await this.createVcsRepository(url, type);
        let existingRepo = await this.getRepository(repo.getUrl(), false, res);

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
     * @param {string}   url   The repository url
     * @param {Response} [res] The response
     *
     * @return {Promise<string>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     */
    public async unregister(url: string, res?: Response): Promise<string> {
        let repo = await this.createVcsRepository(url);
        let existingRepo = await this.getRepository(repo.getUrl(), false, res);

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
     * @param {string}   packageName The package name
     * @param {Response} [res]       The response
     *
     * @return {Promise<VcsRepository|null>}
     */
    public async findRepository(packageName: string, res?: Response): Promise<VcsRepository|null> {
        let cacheRepo = RepositoryManager.getCacheRepository(packageName, res);

        if (cacheRepo) {
            return cacheRepo;
        }

        let repoData = await this.codeRepoRepo.findOne({packageName: packageName});

        if (repoData) {
            let repo = new VcsRepository(repoData, await this.configManager.get());
            RepositoryManager.setCacheRepository(repo, res);

            return repo;
        }

        return null;
    }

    /**
     * Get the repository.
     *
     * @param {string}  url        The repository url
     * @param {boolean} [required] Check if the repository is required
     * @param {Response} [res]     The response
     *
     * @return {Promise<VcsRepository|null>}
     *
     * @throws RepositoryNotFoundError When the repository is not found and it is required
     */
    public async getRepository(url: string, required: boolean = false, res?: Response): Promise<VcsRepository|null> {
        url = await this.validateUrl(url);

        let packageName = RepositoryManager.getCachePackageName(url, res);
        if (packageName) {
            let repo = RepositoryManager.getCacheRepository(packageName, res);
            if (repo) {
                return repo;
            }
        }

        let result = await this.codeRepoRepo.findOne({url: url});
        let repo = result ? new VcsRepository(result, await this.configManager.get()) : null;
        packageName = repo ? repo.getPackageName() : packageName;

        if (repo && packageName) {
            RepositoryManager.setCachePackageName(url, packageName, res);
            RepositoryManager.setCacheRepository(repo, res);
        }

        if (required && null === repo) {
            throw new RepositoryNotFoundError(url);
        }

        return repo;
    }

    /**
     * Get the repository and initialize it if it is not the case.
     *
     * @param {string}   url     The repository url
     * @param {boolean}  [force] Force the initialization
     * @param {Response} [res]   The response
     *
     * @return {Promise<VcsRepository|null>}
     */
    public async getAndInitRepository(url: string, force: boolean = false, res?: Response): Promise<VcsRepository|null> {
        let repo = await this.getRepository(url, false, res);

        if (repo && await this.initRepository(repo, force)) {
            return repo;
        }

        return null;
    }

    /**
     * Get all initialized vcs repositories.
     *
     * @param {boolean}  forceAll Check if all repositories must be returned
     *                            or only returns the initialized repositories
     * @param {Response} [res]    The response
     *
     * @return {Promise<LooseObject<string, VcsRepository>>}
     */
    public async getRepositories(forceAll:boolean = false, res?: Response): Promise<LooseObject> {
        let result = res && res.locals.cacheRepositories ? res.locals.cacheRepositories : {};

        if (!res || !forceAll || (res && !res.locals.allRepoRetrieves && forceAll)) {
            let config = await this.configManager.get();
            result = await retrieveAllRepositories(config, this.codeRepoRepo, forceAll ? result : {}, forceAll);

            if (forceAll && res) {
                res.locals.allRepoRetrieves = true;
                res.locals.cacheRepositories = result;
            }
        }

        return result;
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
            if (e instanceof VcsRepositoryNotFoundError) {
                throw new RepositoryNotSupportedError(e.url);
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

    /**
     * Set the vcs repository in request cache.
     *
     * @param {VcsRepository} repository The vcs repository
     * @param {Response}      [res]      The response
     */
    private static setCacheRepository(repository: VcsRepository, res?: Response): void {
        if (res) {
            res.locals.cacheRepositories = res.locals.cacheRepositories || {};
            res.locals.cacheRepositories[repository.getPackageName() as string] = repository;
        }
    }

    /**
     * Get the vcs repository of the package name.
     *
     * @param {string}   packageName The package name
     * @param {Response} [res]       The response
     *
     * @return {VcsRepository|null}
     */
    private static getCacheRepository(packageName: string, res?: Response): VcsRepository|null {
        if (res && res.locals.cacheRepositories &&  res.locals.cacheRepositories[packageName]) {
            return res.locals.cacheRepositories[packageName];
        }

        return null;
    }

    /**
     * Set the vcs repository in request cache.
     *
     * @param {string}   url         The repository url
     * @param {string}   packageName The package name
     * @param {Response} [res]       The response
     */
    private static setCachePackageName(url: string, packageName: string, res?: Response): void {
        if (res) {
            res.locals.cacheUrlPackages = res.locals.cacheUrlPackages || {};
            res.locals.cacheUrlPackages[url] = packageName;
        }
    }

    /**
     * Get the vcs repository of the package name.
     *
     * @param {string}   url   The repository url
     * @param {Response} [res] The response
     *
     * @return {string|null}
     */
    private static getCachePackageName(url: string, res?: Response): string|null {
        if (res && res.locals.cacheUrlPackages &&  res.locals.cacheUrlPackages[url]) {
            return res.locals.cacheUrlPackages[url];
        }

        return null;
    }
}
