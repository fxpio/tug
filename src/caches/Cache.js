/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DataStorage from '../storages/DataStorage';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Cache
{
    /**
     * Constructor.
     *
     * @param {DataStorage} storage The storage
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Get the cached root packages.
     *
     * @return {Promise<String|null>}
     */
    async getRootPackages() {
        return await this.storage.get('cache/packages.json');
    }

    /**
     * Set the root packages in cache.
     *
     * @param {Object} data The data of root packages
     *
     * @return {Promise<String>}
     */
    async setRootPackages(data) {
        let dataStr = JSON.stringify(data);
        await this.storage.put('cache/packages.json', dataStr);

        return dataStr;
    }

    /**
     * Clean the cache for the root packages.
     *
     * @return {Promise<void>}
     */
    async cleanRootPackages() {
        await this.storage.delete('cache/packages.json');
    }

    /**
     * Get the cached content of package versions.
     *
     * @param {String}      packageName The package name
     * @param {String|null} hash        The hash
     *
     * @return {Promise<String|null>}
     */
    async getPackageVersions(packageName, hash) {
        let content = null;

        if (hash) {
            content = await this.storage.get('cache/packages/' + packageName + '/all$' + hash + '.json');
        }

        return content;
    }

    /**
     * Set the package versions in cache.
     *
     * @param {Object} data The data of package versions
     * @param {String} hash The hash
     *
     * @return {Promise<String>}
     */
    async setPackageVersions(data, hash) {
        let dataStr = JSON.stringify(data);
        await this.storage.put('cache/packages/' + Object.keys(data.packages)[0] + '/all$' + hash + '.json', dataStr);

        return dataStr;
    }

    /**
     * Clean the cache for a package and hash.
     *
     * @param {String} packageName The package name
     * @param {String} hash        The hash
     *
     * @return {Promise<void>}
     */
    async cleanPackageVersions(packageName, hash) {
        await this.cleanRootPackages();
        await this.storage.delete('cache/packages/' + packageName + '/all$' + hash + '.json');
    }
}
