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
import RepositoryNotSupportedError from '../../errors/RepositoryNotSupportedError';
import RepositoryNotFoundError from "../../errors/RepositoryNotFoundError";
import Package from './Package';
import {retrieveAllVersions} from '../../utils/package';

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
     * @param {MessageQueue}      queue       The message queue
     */
    constructor(repoManager, packageRepo, queue) {
        this.repoManager = repoManager;
        this.packageRepo = packageRepo;
        this.queue = queue;
        this.versionParser = new VersionParser();
    }

    /**
     * Find a specific version of package.
     *
     * @param {String} packageName The package name
     * @param {String} version     The version
     *
     * @return {Promise<Package|null>}
     */
    async findPackage(packageName, version) {
        let pack = null;
        let repo = await this.repoManager.findRepository(packageName);

        if (repo) {
            try {
                version = decodeURIComponent(version);
                let normVersion = this.versionParser.normalize(version, version);
                let res = await this.packageRepo.findOne({
                    id: packageName + ':' + normVersion
                });

                if (res) {
                    pack = new Package(res);
                }
            } catch (e) {}
        }

        return pack;
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
            let packages = Object.values(res);
            res = {};
            packages.sort(function (a, b) {
                if (a.getVersion() < b.getVersion()) {
                    return -1;
                } else if (a.getVersion() > b.getVersion()) {
                    return 1;
                } else {
                    return 0;
                }
            });
            packages.sort(function (a, b) {
                let aTime = (new Date(a.getComposer()['time'])).getTime();
                let bTime = (new Date(b.getComposer()['time'])).getTime();
                if (aTime < bTime) {
                    return -1;
                } else if (aTime > bTime) {
                    return 1;
                } else {
                    return 0;
                }
            });
            for (let i = 0; i < packages.length; ++i) {
                res[packages[i].getVersion()] = packages[i];
            }
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

    /**
     * Normalize the version.
     *
     * @param {String} version The version
     *
     * @return {String}
     */
    normalizeVersion(version) {
        return this.versionParser.normalize(version, version);
    }

    /**
     * Refresh the packages.
     *
     * @param {String}  url   The repository url
     * @param {Boolean} force Check if existing packages must be overridden
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     * @throws RepositoryNotFoundError     When the repository is not found
     */
    async refreshPackages(url, force = true) {
        let repo = await this.repoManager.getRepository(url, true);

        await this.queue.send({type: 'refresh-packages', repositoryUrl: repo.getUrl(), force: force});

        return repo;
    }

    /**
     * Refresh the package.
     *
     * @param {String}  url     The repository url
     * @param {String}  version The version to refresh
     * @param {Boolean} force   Check if existing packages must be overridden
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     * @throws RepositoryNotFoundError     When the repository is not found
     */
    async refreshPackage(url, version, force = true) {
        let repo = await this.repoManager.getRepository(url, true);
        let identifier;

        if (version.startsWith('dev-')) {
            identifier = await repo.getDriver().getBranch(version.substring(4));
        } else {
            identifier = await repo.getDriver().getTag(version);
        }

        await this.queue.send({
            type: 'refresh-package',
            repositoryUrl: repo.getUrl(),
            identifier: identifier,
            tag: version,
            force: force
        });

        return repo;
    }

    /**
     * Delete the packages.
     *
     * @param {String} url The repository url
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotFoundError When the repository is not found
     */
    async deletePackages(url) {
        let repo = await this.repoManager.getRepository(url, true);

        if (repo.isInitialized()) {
            await this.queue.send({type: 'delete-packages', repositoryUrl: repo.getUrl()});
        }

        return repo;
    }

    /**
     * Delete the package.
     *
     * @param {String}  url     The repository url
     * @param {String}  version The version to delete
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotFoundError When the repository is not found
     */
    async deletePackage(url, version) {
        let repo = await this.repoManager.getRepository(url, true);

        if (repo.isInitialized()) {
            await this.queue.send({type: 'delete-package', repositoryUrl: repo.getUrl(), version: version});
        }

        return repo;
    }
}
