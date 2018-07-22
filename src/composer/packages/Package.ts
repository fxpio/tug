/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PackageError from '../../errors/PackageError';
import {LooseObject} from '../../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Package
{
    private readonly packageData: LooseObject;

    /**
     * Constructor.
     *
     * @param {LooseObject} packageData The data of package
     *
     * @throws PackageError When the name, version, versionNormalized or composer attribute is not defined
     */
    constructor(packageData: LooseObject) {
        this.packageData = packageData;

        if (!this.packageData['composer']) {
            throw new PackageError('The "composer" attribute of package is required');
        }

        if (typeof this.packageData['composer'] === 'string') {
            this.packageData['composer'] = JSON.parse(this.packageData['composer']);
        }

        if (!this.packageData['name']) {
            if (this.packageData['composer']['name']) {
                this.packageData['name'] = this.packageData['composer']['name'];
            } else {
                throw new PackageError('The "name" attribute of package is required');
            }
        }
        if (!this.packageData['version']) {
            if (this.packageData['composer']['version']) {
                this.packageData['version'] = this.packageData['composer']['version'];
            } else {
                throw new PackageError('The "version" attribute of package is required');
            }
        }
        if (!this.packageData['versionNormalized']) {
            if (this.packageData['composer']['version_normalized']) {
                this.packageData['versionNormalized'] = this.packageData['composer']['version_normalized'];
            } else {
                throw new PackageError('The "versionNormalized" attribute of package is required');
            }
        }
    }

    /**
     * Get the data of repository.
     *
     * @return {LooseObject}
     */
    public getData(): LooseObject {
        if (!this.packageData['id']) {
            this.packageData['id'] = this.getName() + ':' + this.getVersionNormalized();
        }

        let val = Object.assign({}, this.packageData);
        val.composer = JSON.stringify(val.composer);

        return val;
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
     * Get the package name.
     *
     * @return {string}
     */
    public getName(): string {
        return this.packageData['name'];
    }

    /**
     * Get the package version.
     *
     * @return {string}
     */
    public getVersion(): string {
        return this.packageData['version'];
    }

    /**
     * Get the package version normalized.
     *
     * @return {string}
     */
    public getVersionNormalized():string {
        return this.packageData['versionNormalized'];
    }

    /**
     * Get the package composer.
     *
     * @return {LooseObject}
     */
    public getComposer(): LooseObject {
        return this.packageData['composer'];
    }

    /**
     * Add the download count of this package version.
     */
    public addDownloadCount(): void {
        this.packageData['downloadCount'] = this.getDownloadCount() + 1;
    }

    /**
     * Get the download count of this package version.
     *
     * @return {number}
     */
    public getDownloadCount(): number {
        return this.packageData['downloadCount'] ? this.packageData['downloadCount'] : 0;
    }
}
