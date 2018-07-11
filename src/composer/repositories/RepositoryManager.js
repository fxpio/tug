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
    }

    /**
     * Register the repository.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {Object}
     */
    async register(url, type = null) {
        let repo = await this.createVcsRepository(url, type);
        let data = await repo.getData();

        if (!data) {
            data = await this.codeRepoRepo.put(await repo.createData());
        }

        return data;
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
     * Create a vcs repository.
     *
     * @param {String}      url    The repository url
     * @param {String|null} [type] The vcs type
     *
     * @return {Promise<VcsRepository>}
     */
    async createVcsRepository(url, type = null) {
        let repo = new VcsRepository({url: url, type: type}, this.configManager, this.codeRepoRepo, this.cache);

        try {
            await repo.getDriver();
        } catch (e) {
            if (e instanceof VcsDriverNotFoundError) {
                throw new RepositoryNotSupportedError(`The repository with the URL "${url}" is not supported`);
            }
        }

        return repo;
    }
}
