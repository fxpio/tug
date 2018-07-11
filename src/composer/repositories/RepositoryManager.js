/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CodeRepositoryRepository from '../../db/repositories/CodeRepositoryRepository';
import AttributeExists from '../../db/constraints/AttributeExists';
import ConfigManager from '../../configs/ConfigManager';
import DataStorage from '../../storages/DataStorage';
import VcsRepository from './VcsRepository';
import RepositoryNotSupportedError from './RepositoryNotSupportedError';
import VcsDriverNotFoundError from './VcsDriverNotFoundError';

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
     * @param {DataStorage}              cache         The data storage of cache
     */
    constructor(configManager, codeRepoRepo, cache) {
        this.configManager = configManager;
        this.codeRepoRepo = codeRepoRepo;
        this.cache = cache;
        this.cacheRepositories = null;
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
            await this.codeRepoRepo.put(repo.createData());
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
     * Get all initialized vcs repositories.
     *
     * @return {Object<String, VcsRepository>}
     */
    async getRepositories() {
        if (!this.cacheRepositories) {
            this.cacheRepositories = {};
            let config = await this.configManager.get();
            let res = await this.codeRepoRepo.find({packageName: new AttributeExists()});

            for (let repoData of res.results) {
                let repoConfig = {url: repoData.url, type: repoData.type, data: repoData};
                this.cacheRepositories[repoData.packageName] = new VcsRepository(repoConfig, config, this.codeRepoRepo, this.cache);
            }
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
        let repo = new VcsRepository({url: url, type: type}, config, this.codeRepoRepo, this.cache);

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
