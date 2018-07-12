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
import VcsDriverNotFoundError from './VcsDriverNotFoundError';
import {retrieveAllRepositories} from "./utils";

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
     */
    constructor(configManager, codeRepoRepo) {
        this.configManager = configManager;
        this.codeRepoRepo = codeRepoRepo;
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
        let data = await repo.getData();

        if (!data) {
            repo.createData();
            await this.update(repo);
        }

        return repo;
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
        let data = await repo.getData();

        if (data) {
            url = data.url;
            await this.codeRepoRepo.delete(data.id);
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
            let config = await this.configManager.get();
            let repoConfig = {url: repoData.url, type: repoData.type, data: repoData};
            let repo = new VcsRepository(repoConfig, config, this.codeRepoRepo);
            this.cacheRepositories[repoData.packageName] = repo;

            return repo;
        }

        return null;
    }

    /**
     * Update the data of repository.
     *
     * @param {VcsRepository} repository The repository
     *
     * @return {Promise<boolean>}
     */
    async update(repository) {
        let data = await repository.getData();

        if (data) {
            await this.codeRepoRepo.put(data);
            return true;
        }

        return false;
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
     * Create a vcs repository.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {Promise<VcsRepository>}
     */
    async createVcsRepository(url, type = null) {
        let config = await this.configManager.get();
        let repo = new VcsRepository({url: url, type: type}, config, this.codeRepoRepo);

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
