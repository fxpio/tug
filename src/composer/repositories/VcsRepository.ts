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
import {LooseObject} from '../../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsRepository
{
    private readonly drivers: LooseObject;
    private readonly config: Config;
    private readonly repoData: LooseObject;

    private driver: VcsDriver|null;

    /**
     * Constructor.
     *
     * @param {LooseObject}              repoData The data config of composer repository
     * @param {Config}                   config   The config
     * @param {Object<string, Function>} drivers  The map of vcs driver with their names
     *
     * @throws RepositoryError When the url attribute of repo data is not defined
     */
    constructor(repoData: LooseObject, config: Config, drivers?: LooseObject) {
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
    public getDriver(): VcsDriver {
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

        this.driver = new this.drivers[validType](this.repoData, this.config) as VcsDriver;

        return this.driver;
    }

    /**
     * Get the vcs driver type.
     *
     * @return {string}
     */
    public getType(): string {
        this.getDriver();

        return this.repoData['type'];
    }

    /**
     * Get the repository url.
     *
     * @return {string}
     */
    public getUrl(): string {
        this.getDriver();

        return this.repoData['url'];
    }

    /**
     * Get the data of repository.
     *
     * @return {LooseObject}
     */
    public getData(): LooseObject {
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
     * @return {string}
     */
    public getId(): string {
        return this.getData()['id'];
    }

    /**
     * Set the package name.
     *
     * @param {string} name The package name
     */
    public setPackageName(name: string): void {
        if (name) {
            this.repoData['packageName'] = name;
        } else {
            delete this.repoData['packageName'];
        }
    }

    /**
     * Get the package name.
     *
     * @return {string|null}
     */
    public getPackageName(): string|null {
        return this.repoData['packageName'] ? this.repoData['packageName'] : null;
    }

    /**
     * Set the latest hash.
     *
     * @param {string|null} hash The hash
     */
    public setLastHash(hash: string|null): void {
        if (hash) {
            this.repoData['lastHash'] = hash;
        } else {
            delete this.repoData['lastHash'];
        }
    }

    /**
     * Get the last hash of all versions.
     *
     * @return {string|null}
     */
    public getLastHash(): string|null {
        return this.repoData['lastHash'] ? this.repoData['lastHash'] : null;
    }

    /**
     * Set the root identifier.
     *
     * @param {string} rootIdentifier The root identifier
     */
    public setRootIdentifier(rootIdentifier: string): void {
        if (rootIdentifier) {
            this.repoData['rootIdentifier'] = rootIdentifier;
        } else {
            delete this.repoData['rootIdentifier'];
        }
    }

    /**
     * Get the package name.
     *
     * @return {string|null}
     */
    public getRootIdentifier(): string|null {
        return this.repoData['rootIdentifier'] ? this.repoData['rootIdentifier'] : null;
    }

    /**
     * Add the download count of all package versions.
     */
    public addDownloadCount(): void {
        this.repoData['downloadCount'] = this.getDownloadCount() + 1;
    }

    /**
     * Get the download count of all package versions.
     *
     * @return {number}
     */
    public getDownloadCount(): number {
        return this.repoData['downloadCount'] ? this.repoData['downloadCount'] : 0;
    }

    /**
     * Check if the repository has already been initialized.
     *
     * @return {boolean}
     */
    public isInitialized(): boolean {
        return null !== this.getPackageName() && null !== this.getLastHash();
    }
}
