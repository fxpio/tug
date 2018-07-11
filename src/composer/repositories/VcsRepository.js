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
import Repository from './Repository';
import VcsDriver from './vcs-drivers/VcsDriver';
import GithubDriver from './vcs-drivers/GithubDriver';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsRepository extends Repository
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
        super();
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
    }

    /**
     * @inheritDoc
     */
    async initialize() {
        await super.initialize();
        this.driver = this.getDriver();

        if (!this.driver) {
            throw new Error('No driver found to handle VCS repository ' + this.url);
        }
    }

    /**
     * Get the vcs driver.
     *
     * @return {Promise<VcsDriver|null>}
     */
    async getDriver() {
        if (false === this.driver) {
            return null;
        } else if (this.driver) {
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

        this.driver = validType ? new this.drivers[validType](this.repoConfig, config, this.cache) : false;
        this.driverType = validType ? 'vcs-' + validType : null;
        this.repoConfig['type'] = this.driverType;
        this.url = this.driver ? this.driver.getUrl() : this.url;

        return this.driver ? this.driver : null;
    }

    /**
     * Get the vcs driver type.
     *
     * @return {Promise<String|null>}
     */
    async getDriverType() {
        await this.getDriver();

        return this.driverType;
    }
}
