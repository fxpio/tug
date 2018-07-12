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
import And from '../../db/constraints/And';
import Not from '../../db/constraints/Not';
import In from '../../db/constraints/In';
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
     * Find a vcs repository for a package name.
     *
     * @param {String} packageName The package name
     *
     * @return {VcsRepository|null}
     */
    async findRepository(packageName) {
        let repoData = await this.codeRepoRepo.findOne({packageName: packageName});

        if (repoData) {
            let config = await this.configManager.get();
            let repoConfig = {url: repoData.url, type: repoData.type, data: repoData};
            let repo = new VcsRepository(repoConfig, config, this.codeRepoRepo, this.cache);
            this.cacheRepositories[repoData.packageName] = repo;

            return repo;
        }

        return null;
    }

    /**
     * Get all initialized vcs repositories.
     *
     * @return {Object<String, VcsRepository>}
     */
    async getRepositories() {
        if (!this.allRepoRetrieves) {
            this.allRepoRetrieves = true;
            let config = await this.configManager.get();
            let packageConstraint = new AttributeExists();
            let packagesNames = Object.keys(this.cacheRepositories);

            if (packagesNames.length > 0) {
                packageConstraint = new And([packageConstraint, new Not(new In(packagesNames))]);
            }

            let res = await this.codeRepoRepo.find({packageName: packageConstraint});

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
