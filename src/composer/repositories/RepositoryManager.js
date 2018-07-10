/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import GithubDriver from "./vcs-drivers/GithubDriver";
import CodeRepositoryRepository from '../../db/repositories/CodeRepositoryRepository';
import ConfigManager from '../../configs/ConfigManager';
import {URL} from 'url';

const VCS_DRIVERS = {
    'github': GithubDriver
};

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
        type = await this.getVcsType(url, type);

        if (null === type) {
            throw new Error(`The repository with the URL "${url}" is not supported`);
        }

        let item = await this.codeRepoRepo.findOne({url: url});

        if (null === item) {
            let repoUrl = new URL(url);
            item = {
                id: type + ':' + repoUrl.host + ':' + repoUrl.pathname.replace(/^\/|.[a-zA-Z0-9]{1,5}$/g, ''),
                model: this.codeRepoRepo.getPrefixedId('').replace(/:$/g, ''),
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
        let type = await this.getVcsType(url);

        if (null === type) {
            throw new Error(`The repository with the URL "${url}" is not supported`);
        }

        let item = await this.codeRepoRepo.findOne({url: url});

        if (null !== item) {
            await this.codeRepoRepo.delete(item.id);
        }
    }

    /**
     * Get the VCS type for the repository URL is supported.
     *
     * @param {String}      url    URL to validate/check
     * @param {String|null} [type] The vcs type
     *
     * @return {String|null}
     */
    async getVcsType(url, type = null) {
        type = type ? type.replace(/^vcs-/g, '') : type;

        if (url && type && VCS_DRIVERS[type]) {
            return 'vcs-' + type;
        }

        let config = await this.configManager.get();
        let types = Object.keys(VCS_DRIVERS);

        for (let i = 0; i < types.length; ++i) {
            if (VCS_DRIVERS[types[i]].supports(config, url)) {
                return 'vcs-' + types[i];
            }
        }

        for (let i = 0; i < types.length; ++i) {
            if (VCS_DRIVERS[types[i]].supports(config, url, true)) {
                return 'vcs-' + types[i];
            }
        }

        return null;
    }
}
