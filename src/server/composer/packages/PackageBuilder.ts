/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Cache} from '@server/caches/Cache';
import {PackageManager} from '@server/composer/packages/PackageManager';
import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {createHash} from '@server/utils/crypto';
import {LooseObject} from '@server/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class PackageBuilder {
    private readonly repoManager: RepositoryManager;
    private readonly packageManager: PackageManager;
    private readonly cache: Cache;

    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager    The composer repository manager
     * @param {PackageManager}    packageManager The composer package manager
     * @param {Cache}             cache          The cache
     */
    constructor(repoManager: RepositoryManager, packageManager: PackageManager, cache: Cache) {
        this.repoManager = repoManager;
        this.packageManager = packageManager;
        this.cache = cache;
    }

    /**
     * Builds the JSON stuff of the repository.
     *
     * @param {string}   packageName The package name
     * @param {string}   [hash]      The hash of package versions
     * @param {Response} [res]       The response
     *
     * @return {{name: string, hash: string, content: string}|null}
     */
    public async buildVersions(packageName: string, hash?: string, res?: Response): Promise<LooseObject|null> {
        RepositoryManager.clearCache(res);
        const repo = await this.repoManager.findRepository(packageName, res);
        const result = await this.packageManager.findPackages(packageName, undefined, res);

        if (repo && null !== result) {
            if (Object.keys(result).length > 0) {
                const data: LooseObject = {packages: {}};
                data.packages[packageName] = {};
                for (const version of Object.keys(result)) {
                    const pack = result[version];
                    data.packages[packageName][pack.getVersion()] = pack.getComposer();
                }
                const content = JSON.stringify(data);

                if (hash) {
                    await this.cache.setPackageVersions(packageName, hash, content);
                } else {
                    hash = createHash(content);

                    await this.cache.setPackageVersions(packageName, hash, content);
                    repo.setLastHash(hash);
                    await this.repoManager.update(repo);
                    await this.cache.cleanRootPackages();
                }

                return {
                    name: packageName,
                    hash,
                    content,
                };
            } else {
                if (null === hash) {
                    repo.setLastHash(null);
                    await this.repoManager.update(repo);
                }
                await this.cache.cleanRootPackages();
            }
        }

        return null;
    }

    /**
     * Builds the JSON stuff of the root packages.
     *
     * @param {Response} [res] The response
     *
     * @return {Promise<string>}
     */
    public async buildRootPackages(res?: Response): Promise<string> {
        const repos = await this.repoManager.getRepositories(false, res);
        const data: LooseObject = {'notify-batch': '/downloads', 'packages': {}, 'includes': {}};

        for (const key of Object.keys(repos)) {
            const name = repos[key].getPackageName();
            const hash = repos[key].getLastHash();
            data.includes[`p/${name}$${hash}.json`] = {sha1: hash};
        }

        return await this.cache.setRootPackages(JSON.stringify(data));
    }
}
