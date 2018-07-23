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
    private storage: DataStorage;

    /**
     * Constructor.
     *
     * @param {DataStorage} storage The storage
     */
    constructor(storage: DataStorage) {
        this.storage = storage;
    }

    /**
     * Get the cached root packages.
     *
     * @return {Promise<string|null>}
     */
    public async getRootPackages(): Promise<string|null> {
        return await this.storage.get('cache/packages.json');
    }

    /**
     * Set the root packages in cache.
     *
     * @param {string} content The content of root packages
     *
     * @return {Promise<string>}
     */
    public async setRootPackages(content: string): Promise<string> {
        await this.storage.put('cache/packages.json', content);

        return content;
    }

    /**
     * Clean the cache for the root packages.
     *
     * @return {Promise<void>}
     */
    public async cleanRootPackages(): Promise<void> {
        await this.storage.delete('cache/packages.json');
    }

    /**
     * Get the cached content of package versions.
     *
     * @param {string}      packageName The package name
     * @param {string|null} [hash]      The hash
     *
     * @return {Promise<string|null>}
     */
    public async getPackageVersions(packageName: string, hash?: string): Promise<string|null> {
        let content = null;

        if (hash) {
            content = await this.storage.get('cache/packages/' + packageName + '/all$' + hash + '.json');
        }

        return content;
    }

    /**
     * Set the package versions in cache.
     *
     * @param {string} packageName The package name
     * @param {string} hash        The hash
     * @param {string} content     The content of package versions
     *
     * @return {Promise<string>}
     */
    public async setPackageVersions(packageName: string, hash: string, content: string): Promise<string> {
        await this.storage.put('cache/packages/' + packageName + '/all$' + hash + '.json', content);

        return content;
    }

    /**
     * Clean the cache for a package and hash.
     *
     * @param {string} packageName The package name
     * @param {string} hash        The hash
     *
     * @return {Promise<void>}
     */
    public async cleanPackageVersions(packageName: string, hash: string): Promise<void> {
        await this.cleanRootPackages();
        await this.storage.delete('cache/packages/' + packageName + '/all$' + hash + '.json');
    }
}
