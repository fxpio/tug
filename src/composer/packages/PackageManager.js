/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import RepositoryManager from '../repositories/RepositoryManager';
import VersionParser from '../semver/VersionParser';
import {retrieveAllVersions} from '../../utils/package';
import Package from './Package';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class PackageManager
{
    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager The composer repository manager
     * @param {PackageRepository} packageRepo The database repository of package
     */
    constructor(repoManager, packageRepo) {
        this.repoManager = repoManager;
        this.packageRepo = packageRepo;
        this.versionParser = new VersionParser();
    }

    /**
     * Find a specific version of package.
     *
     * @param {String} packageName The package name
     * @param {String} version     The version
     *
     * @return {Promise<Object|null>}
     */
    async findPackage(packageName, version) {
        let packageData = null;
        let repo = await this.repoManager.findRepository(packageName);

        if (repo) {
            try {
                version = decodeURIComponent(version);
                let normVersion = this.versionParser.normalize(version, version);
                let res = await this.packageRepo.findOne({
                    id: packageName + ':' + normVersion
                });

                if (res) {
                    packageData = res.package;
                }
            } catch (e) {}
        }

        return packageData;
    }

    /**
     * Find all versions of package.
     *
     * @param {String}      packageName The package name
     * @param {String|null} hash        The hash
     *
     * @return {Promise<Object<String, Package>>}
     */
    async findPackages(packageName, hash = null) {
        let res = {};
        let repo = await this.repoManager.findRepository(packageName);

        if (repo && (!hash || hash === repo.getLastHash())) {
            res = await retrieveAllVersions(packageName, this.packageRepo, {});
        }

        return res;
    }

    /**
     * Update the package.
     *
     * @param {Package} pack The package
     */
    async update(pack) {
        await this.packageRepo.put(pack.getData());
    }

    /**
     * Delete the repository.
     *
     * @param {Package} pack The package
     */
    async delete(pack) {
        await this.packageRepo.delete(pack.getId());
    }
}
