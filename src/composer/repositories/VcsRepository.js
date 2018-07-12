/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Config from '../../configs/Config';
import CodeRepositoryRepository from '../../db/repositories/CodeRepositoryRepository';
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
     * @param {Config}                   config        The config
     * @param {CodeRepositoryRepository} codeRepoRepo  The database repository for composer repository
     * @param {Object<String, Function>} drivers       The map of vcs driver with their names
     */
    constructor(repoConfig, config, codeRepoRepo, drivers = null) {
        this.drivers = drivers ? drivers : {
            'github': GithubDriver
        };

        this.codeRepoRepo = codeRepoRepo;
        this.config = config;
        this.repoConfig = repoConfig;
        this.url = this.repoConfig['url'];
        this.driverType = this.repoConfig['type'] ? this.repoConfig['type'] : null;
        this.driver = null;
        this.repoData = null;

        if (this.repoConfig.data) {
            this.repoData = this.repoConfig.data;
            delete this.repoConfig.data;
            this.getDriver();
        }
    }

    /**
     * Get the repository url.
     *
     * @return {String}
     */
    getUrl() {
        try {
            this.getDriver();
        } catch (e) {}

        return this.url;
    }

    /**
     * Get the vcs driver.
     *
     * @return {VcsDriver}
     *
     * @throws VcsDriverNotFoundError When the vcs driver is not found
     */
    getDriver() {
        if (this.driver) {
            return this.driver;
        }

        let types = Object.keys(this.drivers);
        let type = this.driverType ? this.driverType.replace(/^vcs-/g, '') : '';
        let validType = null;

        if (this.url && this.drivers[type]) {
            validType = type;
        } else {
            for (let i = 0; i < types.length; ++i) {
                if (this.drivers[types[i]].supports(this.config, this.url)) {
                    validType = types[i];
                    break;
                }
            }

            if (!validType) {
                for (let i = 0; i < types.length; ++i) {
                    if (this.drivers[types[i]].supports(this.config, this.url, true)) {
                        validType = types[i];
                        break;
                    }
                }
            }
        }

        if (!validType || !this.drivers[validType].supports(this.config, this.url)) {
            throw new VcsDriverNotFoundError('No driver found to handle VCS repository ' + this.url);
        }

        this.driver = new this.drivers[validType](this.repoConfig, this.config);
        this.driverType = 'vcs-' + validType;
        this.repoConfig['type'] = this.driverType;
        this.url = this.driver.getUrl();

        return this.driver;
    }

    /**
     * Get the vcs driver type.
     *
     * @return {String}
     */
    getDriverType() {
        this.getDriver();

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

        let driver = this.getDriver();
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
     * @return {Object}
     */
    createData() {
        let type = this.getDriverType();
        let repoUrl = new URL(this.url);

        this.repoData = {
            id: type + ':' + repoUrl.host + ':' + repoUrl.pathname.replace(/^\/|(\.[a-zA-Z0-9]{1,5})$/g, ''),
            type: type,
            url: this.url
        };

        return this.repoData;
    }
    }
}
