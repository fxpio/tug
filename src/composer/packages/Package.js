/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PackageError from '../../errors/PackageError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Package
{
    /**
     * Constructor.
     *
     * @param {Object} packageData The data of package
     *
     * @throws PackageError When the name, version, versionNormalized or composer attribute is not defined
     */
    constructor(packageData) {
        this.packageData = packageData;

        if (!this.packageData['name']) {
            throw new PackageError('The "name" attribute of package is required');
        }
        if (!this.packageData['version']) {
            throw new PackageError('The "version" attribute of package is required');
        }
        if (!this.packageData['versionNormalized']) {
            throw new PackageError('The "versionNormalized" attribute of package is required');
        }
        if (!this.packageData['composer']) {
            throw new PackageError('The "composer" attribute of package is required');
        }
    }

    /**
     * Get the data of repository.
     *
     * @return {Object}
     */
    getData() {
        if (!this.packageData['id']) {
            this.packageData['id'] = this.getName() + ':' + this.getVersionNormalized();
        }

        return this.packageData;
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
     * Get the package name.
     *
     * @return {String}
     */
    getName() {
        return this.getData()['name'];
    }

    /**
     * Get the package version.
     *
     * @return {String}
     */
    getVersion() {
        return this.getData()['version'];
    }

    /**
     * Get the package version normalized.
     *
     * @return {String}
     */
    getVersionNormalized() {
        return this.getData()['versionNormalized'];
    }

    /**
     * Set the package composer.
     *
     * @param {Object} composer The package composer
     */
    setComposer(composer) {
        this.getData()['composer'] = composer;
    }

    /**
     * Get the package composer.
     *
     * @return {Object}
     */
    getComposer() {
        return this.getData()['composer'];
    }
}
