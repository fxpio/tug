/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Config from '../../configs/Config';
import VcsDriver from './vcs-drivers/VcsDriver';
import GithubDriver from './vcs-drivers/GithubDriver';
import GitlabDriver from './vcs-drivers/GitlabDriver';
import RepositoryError from '../../errors/RepositoryError';
import VcsDriverNotFoundError from '../../errors/VcsDriverNotFoundError';
import {URL} from 'url';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsRepository
{
    /**
     * Constructor.
     *
     * @param {Object}                   repoData The data config of composer repository
     * @param {Config}                   config   The config
     * @param {Object<String, Function>} drivers  The map of vcs driver with their names
     *
     * @throws RepositoryError When the url attribute of repo data is not defined
     */
    constructor(repoData, config, drivers = null) {
        this.drivers = drivers ? drivers : {
            'github': GithubDriver,
            'gitlab': GitlabDriver
        };

        this.config = config;
        this.repoData = repoData;
        this.driver = null;

        if (!this.repoData['url']) {
            throw new RepositoryError('The "url" attribute of vcs repository is required');
        }
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

        let url = this.repoData['url'];
        let types = Object.keys(this.drivers);
        let type = this.repoData['type'] ? this.repoData['type'].replace(/^vcs-/g, '') : '';
        let validType = null;

        if (url && this.drivers[type]) {
            validType = type;
        } else {
            for (let i = 0; i < types.length; ++i) {
                if (this.drivers[types[i]].supports(this.config, url)) {
                    validType = types[i];
                    break;
                }
            }

            if (!validType) {
                for (let i = 0; i < types.length; ++i) {
                    if (this.drivers[types[i]].supports(this.config, url, true)) {
                        validType = types[i];
                        break;
                    }
                }
            }
        }

        if (!validType || !this.drivers[validType].supports(this.config, url)) {
            throw new VcsDriverNotFoundError('No driver found to handle VCS repository ' + url);
        }

        this.driver = new this.drivers[validType](this.repoData, this.config);
        this.repoData['type'] = 'vcs-' + validType;
        this.repoData['url'] = this.driver.getUrl();

        return this.driver;
    }

    /**
     * Get the vcs driver type.
     *
     * @return {String}
     */
    getType() {
        this.getDriver();

        return this.repoData['type'];
    }

    /**
     * Get the repository url.
     *
     * @return {String}
     */
    getUrl() {
        this.getDriver();

        return this.repoData['url'];
    }

    /**
     * Get the data of repository.
     *
     * @return {Object}
     */
    getData() {
        let type = this.getType();

        if (!this.repoData['id']) {
            let repoUrl = new URL(this.repoData['url']);
            this.repoData['id'] = type + ':' + repoUrl.host + ':' + repoUrl.pathname.replace(/^\/|(\.[a-zA-Z0-9]{1,5})$/g, '');
        }

        return this.repoData;
    }

    /**
     * Get the id.
     *
     * @return {String}
     */
    getId() {
        return this.getData()['id'];
    }

    /**
     * Set the package name.
     *
     * @param {String} name The package name
     */
    setPackageName(name) {
        this.repoData['packageName'] = name;
    }

    /**
     * Get the package name.
     *
     * @return {String|null}
     */
    getPackageName() {
        return this.repoData['packageName'] ? this.repoData['packageName'] : null;
    }

    /**
     * Set the latest hash.
     *
     * @param {String} hash The hash
     */
    setLastHash(hash) {
        this.repoData['lastHash'] = hash;
    }

    /**
     * Get the last hash of all versions.
     *
     * @return {String|null}
     */
    getLastHash() {
        return this.repoData['lastHash'] ? this.repoData['lastHash'] : null;
    }

    /**
     * Set the root identifier.
     *
     * @param {String} rootIdentifier The root identifier
     */
    setRootIdentifier(rootIdentifier) {
        this.repoData['rootIdentifier'] = rootIdentifier;
    }

    /**
     * Get the package name.
     *
     * @return {String|null}
     */
    getRootIdentifier() {
        return this.repoData['rootIdentifier'] ? this.repoData['rootIdentifier'] : null;

    /**
     * Check if the repository has already been initialized.
     *
     * @return {Boolean}
     */
    isInitialized() {
        return null !== this.getPackageName() && null !== this.getLastHash();
    }
}
