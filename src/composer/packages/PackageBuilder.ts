/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Response} from 'express';
import {Cache} from '@app/caches/Cache';
import {RepositoryManager} from '@app/composer/repositories/RepositoryManager';
import {PackageManager} from '@app/composer/packages/PackageManager';
import {LooseObject} from '@app/utils/LooseObject';
import {createHash} from '@app/utils/crypto';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class PackageBuilder
{
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
        let repo = await this.repoManager.findRepository(packageName, res);
        let result = await this.packageManager.findPackages(packageName, undefined, res);

        if (repo) {
            if (Object.keys(result).length > 0) {
                let data: LooseObject = {packages: {}};
                data.packages[packageName] = {};
                for (let version of Object.keys(result)) {
                    let pack = result[version];
                    data.packages[packageName][pack.getVersion()] = pack.getComposer();
                }
                let content = JSON.stringify(data);

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
                    hash: hash,
                    content: content
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
        let repos = await this.repoManager.getRepositories(false, res);
        let data: LooseObject = {'notify-batch': '/downloads', packages: {}, includes: {}};

        for (let key of Object.keys(repos)) {
            let name = repos[key].getPackageName();
            let hash = repos[key].getLastHash();
            data.includes[`p/${name}$${hash}.json`] = {'sha1': hash};
        }

        return await this.cache.setRootPackages(JSON.stringify(data));
    }
}
