/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ConfigManager from '../../configs/ConfigManager';
import CodeRepositoryRepository from '../../db/repositories/CodeRepositoryRepository';
import DataStorage from '../../storages/DataStorage';
import VcsDriver from './vcs-drivers/VcsDriver';
import GithubDriver from './vcs-drivers/GithubDriver';
import VcsDriverNotFoundError from './VcsDriverNotFoundError';
import {URL} from 'url';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsRepository
{
    /**
     * Constructor.
     *
     * @param {Object}                   repoConfig    The config of composer repository
     * @param {ConfigManager}            configManager The config manager
     * @param {CodeRepositoryRepository} codeRepoRepo  The database repository for composer repository
     * @param {DataStorage}              cache         The data storage of cache
     * @param {Object<String, Function>} drivers       The map of vcs driver with their names
     */
    constructor(repoConfig, configManager, codeRepoRepo, cache, drivers = null) {
        this.drivers = drivers ? drivers : {
            'github': GithubDriver
        };

        this.cache = cache;
        this.codeRepoRepo = codeRepoRepo;
        this.configManager = configManager;
        this.repoConfig = repoConfig;
        this.url = this.repoConfig['url'];
        this.driverType = this.repoConfig['type'] ? this.repoConfig['type'] : null;
        this.driver = null;
        this.repoData = null;
    }

    /**
     * Get the vcs driver.
     *
     * @return {Promise<VcsDriver>}
     *
     * @throws VcsDriverNotFoundError When the vcs driver is not found
     */
    async getDriver() {
        if (this.driver) {
            return this.driver;
        }

        let types = Object.keys(this.drivers);
        let type = this.driverType ? this.driverType.replace(/^vcs-/g, '') : '';
        let config = await this.configManager.get();
        let validType = null;

        if (this.url && this.drivers[type]) {
            validType = type;
        } else {
            for (let i = 0; i < types.length; ++i) {
                if (this.drivers[types[i]].supports(config, this.url)) {
                    validType = types[i];
                    break;
                }
            }

            if (!validType) {
                for (let i = 0; i < types.length; ++i) {
                    if (this.drivers[types[i]].supports(config, this.url, true)) {
                        validType = types[i];
                        break;
                    }
                }
            }
        }

        if (!validType) {
            throw new VcsDriverNotFoundError('No driver found to handle VCS repository ' + this.url);
        }

        this.driver = new this.drivers[validType](this.repoConfig, config, this.cache);
        this.driverType = 'vcs-' + validType;
        this.repoConfig['type'] = this.driverType;
        this.url = this.driver.getUrl();

        return this.driver;
    }

    /**
     * Get the vcs driver type.
     *
     * @return {Promise<String>}
     */
    async getDriverType() {
        await this.getDriver();

        return this.driverType;
    }

    /**
     * Get the data of repository.
     *
     * @return {Promise<Object|null>}
     */
    async getData() {
        if (false === this.repoData) {
            return null;
        } else if (this.repoData) {
            return this.repoData;
        }

        let driver = await this.getDriver();
        if (!driver) {
            this.repoData = false;
            return null;
        }

        let url = driver.getUrl();
        let item = await this.codeRepoRepo.findOne({url: url});

        if (item) {
            this.repoData = item;
            return item;
        }

        this.repoData = false;
        return null;
    }

    /**
     * Create the data repository.
     *
     * @return {Promise<{Object}>}
     */
    async createData() {
        let type = await this.getDriverType();
        let repoUrl = new URL(this.url);

        return {
            id: type + ':' + repoUrl.host + ':' + repoUrl.pathname.replace(/^\/|(\.[a-zA-Z0-9]{1,5})$/g, ''),
            type: type,
            url: this.url
        };
    }
}
