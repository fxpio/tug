/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import crypto from 'crypto';
import Cache from '../../caches/Cache';
import RepositoryManager from '../repositories/RepositoryManager';
import PackageManager from './PackageManager';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class PackageBuilder
{
    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager    The composer repository manager
     * @param {PackageManager}    packageManager The composer package manager
     * @param {Cache}             cache          The cache
     */
    constructor(repoManager, packageManager, cache) {
        this.repoManager = repoManager;
        this.packageManager = packageManager;
        this.cache = cache;
    }

    /**
     * Builds the JSON stuff of the repository.
     *
     * @param {String}      packageName The package name
     * @param {String|null} [hash]      The hash of package versions
     *
     * @return {{name: String, hash: String, content: String}|null}
     */
    async buildVersions(packageName, hash = null) {
        let repo = await this.repoManager.findRepository(packageName);
        let res = await this.packageManager.findPackages(packageName);

        if (repo) {
            if (Object.keys(res).length > 0) {
                let data = {packages: {}};
                data.packages[packageName] = {};
                for (let version of Object.keys(res)) {
                    let pack = res[version];
                    data.packages[packageName][pack.getVersion()] = pack.getComposer();
                }
                let content = JSON.stringify(data);

                if (hash) {
                    await this.cache.setPackageVersions(packageName, hash, content);
                } else {
                    hash = crypto.createHash('sha1');
                    hash.update(content);
                    hash = hash.digest('hex');

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
     * @return {Promise<String|null>}
     */
    async buildRootPackages() {
        let repos = await this.repoManager.getRepositories();
        let data = {packages: {}, includes: {}};

        for (let key of Object.keys(repos)) {
            let name = repos[key].getPackageName();
            let hash = repos[key].getLastHash();
            data.includes[`p/${name}$${hash}.json`] = {'sha1': hash};
        }

        return await this.cache.setRootPackages(JSON.stringify(data));
    }
}
