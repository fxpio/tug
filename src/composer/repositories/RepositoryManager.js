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
import Repository from './Repository';
import VcsRepository from './VcsRepository';
import RepositoryNotSupportedError from './RepositoryNotSupportedError';
import {URL} from 'url';

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
        let repo = new VcsRepository({url: url, type: type}, this.configManager, this.codeRepoRepo, this.cache);
        type = await repo.getDriverType();

        if (null === type) {
            throw new RepositoryNotSupportedError(`The repository with the URL "${url}" is not supported`);
        }

        url = (await repo.getDriver()).getUrl();
        let item = await this.codeRepoRepo.findOne({url: url});

        if (null === item) {
            let repoUrl = new URL(url);
            item = {
                id: type + ':' + repoUrl.host + ':' + repoUrl.pathname.replace(/^\/|(\.[a-zA-Z0-9]{1,5})$/g, ''),
                type: type,
                url: url
            };

            await this.codeRepoRepo.put(item);
        }

        return item;
    }

    /**
     * Unregister the repository.
     *
     * @param {String} url The repository url
     */
    async unregister(url) {
        let repo = new VcsRepository({url: url}, this.configManager, this.codeRepoRepo, this.cache);
        let type = await repo.getDriverType();

        if (null === type) {
            throw new RepositoryNotSupportedError(`The repository with the URL "${url}" is not supported`);
        }

        let item = await this.codeRepoRepo.findOne({url: url});

        if (null !== item) {
            await this.codeRepoRepo.delete(item.id);
        }
    }
}
