/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Package} from '@server/composer/packages/Package';
import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {VcsRepository} from '@server/composer/repositories/VcsRepository';
import {VersionParser} from '@server/composer/semver/VersionParser';
import {PackageRepository} from '@server/db/repositories/PackageRepository';
import {RepositoryNotFoundError} from '@server/errors/RepositoryNotFoundError';
import {RepositoryNotSupportedError} from '@server/errors/RepositoryNotSupportedError';
import {MessageQueue} from '@server/queues/MessageQueue';
import {LooseObject} from '@server/utils/LooseObject';
import {retrieveAllVersions} from '@server/utils/package';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class PackageManager {
    private readonly repoManager: RepositoryManager;
    private readonly packageRepo: PackageRepository;
    private readonly queue: MessageQueue;
    private readonly versionParser: VersionParser;

    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager The composer repository manager
     * @param {PackageRepository} packageRepo The database repository of package
     * @param {MessageQueue}      queue       The message queue
     */
    constructor(repoManager: RepositoryManager, packageRepo: PackageRepository, queue: MessageQueue) {
        this.repoManager = repoManager;
        this.packageRepo = packageRepo;
        this.queue = queue;
        this.versionParser = new VersionParser();
    }

    /**
     * Find a specific version of package.
     *
     * @param {string}   packageName The package name
     * @param {string}   version     The version
     * @param {Response} [res]       The response
     *
     * @return {Promise<Package|null>}
     */
    public async findPackage(packageName: string, version: string, res?: Response): Promise<Package|null> {
        let pack = null;
        const repo = await this.repoManager.findRepository(packageName, res);

        if (repo) {
            try {
                version = decodeURIComponent(version);
                const normVersion = this.versionParser.normalize(version, version);
                const res = await this.packageRepo.findOne({
                    id: packageName + ':' + normVersion,
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
     * @param {string}   packageName The package name
     * @param {string}   hash        The hash
     * @param {Response} [res]       The response
     *
     * @return {Promise<LooseObject<string, Package>>}
     */
    public async findPackages(packageName: string, hash?: string, res?: Response): Promise<LooseObject<Package>> {
        let result: LooseObject = {};
        const repo = await this.repoManager.findRepository(packageName, res);

        if (repo && (!hash || hash === repo.getLastHash())) {
            result = await retrieveAllVersions(packageName, this.packageRepo, {});
            const packages: Package[] = Object.values(result);
            result = {};
            packages.sort((a: Package|any, b: Package|any) => {
                if (a.getVersion() < b.getVersion()) {
                    return -1;
                } else if (a.getVersion() > b.getVersion()) {
                    return 1;
                } else {
                    return 0;
                }
            });
            packages.sort((a: Package|any, b: Package|any) => {
                const aTime = (new Date(a.getComposer().time)).getTime();
                const bTime = (new Date(b.getComposer().time)).getTime();
                if (aTime < bTime) {
                    return -1;
                } else if (aTime > bTime) {
                    return 1;
                } else {
                    return 0;
                }
            });

            for (const cPackage of packages) {
                result[cPackage.getVersion()] = cPackage;
            }
        }

        return result;
    }

    /**
     * Update the package.
     *
     * @param {Package} pack The package
     *
     * @return {Promise<void>}
     */
    public async update(pack: Package): Promise<void> {
        await this.packageRepo.put(pack.getData());
    }

    /**
     * Delete the repository.
     *
     * @param {Package} pack The package
     *
     * @return {Promise<void>}
     */
    public async delete(pack: Package): Promise<void> {
        await this.packageRepo.delete(pack.getId());
    }

    /**
     * Normalize the version.
     *
     * @param {string} version The version
     *
     * @return {string}
     */
    public normalizeVersion(version: string): string {
        return this.versionParser.normalize(version, version);
    }

    /**
     * Refresh all packages.
     *
     * @param {boolean}  force Check if existing packages must be overridden
     * @param {Response} [res] The response
     *
     * @return {Promise<LooseObject<string, VcsRepository>>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     * @throws RepositoryNotFoundError     When the repository is not found
     */
    public async refreshAllPackages(force: boolean = true, res?: Response): Promise<LooseObject> {
        const repos = await this.repoManager.getRepositories(true, res);
        const messages = [];

        for (const name of Object.keys(repos)) {
            messages.push({type: 'refresh-packages', repositoryUrl: repos[name].getUrl(), force});
        }

        await this.queue.sendBatch(messages);

        return repos;
    }

    /**
     * Refresh the packages.
     *
     * @param {string}   url   The repository url
     * @param {boolean}  force Check if existing packages must be overridden
     * @param {Response} [res] The response
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     * @throws RepositoryNotFoundError     When the repository is not found
     */
    public async refreshPackages(url: string, force: boolean = true, res?: Response): Promise<VcsRepository> {
        const repo = await this.repoManager.getRepository(url, true, res) as VcsRepository;

        await this.queue.send({type: 'refresh-packages', repositoryUrl: repo.getUrl(), force});

        return repo;
    }

    /**
     * Refresh the package.
     *
     * @param {string}   url     The repository url
     * @param {string}   version The version to refresh
     * @param {boolean}  force   Check if existing packages must be overridden
     * @param {Response} [res]   The response
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     * @throws RepositoryNotFoundError     When the repository is not found
     */
    public async refreshPackage(url: string, version: string, force: boolean = true, res?: Response): Promise<VcsRepository> {
        const repo = await this.repoManager.getRepository(url, true, res) as VcsRepository;
        let identifier;

        if (version.startsWith('dev-')) {
            identifier = await repo.getDriver().getBranch(version.substring(4));
        } else {
            identifier = await repo.getDriver().getTag(version);
        }

        await this.queue.send({
            type: 'refresh-package',
            repositoryUrl: repo.getUrl(),
            identifier,
            version,
            force,
        });

        return repo;
    }

    /**
     * Delete the packages.
     *
     * @param {string}   url   The repository url
     * @param {Response} [res] The response
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotFoundError When the repository is not found
     */
    public async deletePackages(url: string, res?: Response): Promise<VcsRepository> {
        const repo = await this.repoManager.getRepository(url, true, res) as VcsRepository;

        if (repo.isInitialized()) {
            await this.queue.send({type: 'delete-packages', packageName: repo.getPackageName()});
        }

        return repo;
    }

    /**
     * Delete the package.
     *
     * @param {string}   url     The repository url
     * @param {string}   version The version to delete
     * @param {Response} [res]   The response
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotFoundError When the repository is not found
     */
    public async deletePackage(url: string, version: string, res?: Response): Promise<VcsRepository> {
        const repo = await this.repoManager.getRepository(url, true, res) as VcsRepository;

        if (repo.isInitialized()) {
            await this.queue.send({type: 'delete-package', packageName: repo.getPackageName(), version});
        }

        return repo;
    }

    /**
     * Refresh all cache packages.
     *
     * @param {Response} [res] The response
     *
     * @return {Promise<Object<string, VcsRepository>>}
     */
    public async refreshAllCachePackages(res?: Response): Promise<LooseObject> {
        const repos = await this.repoManager.getRepositories(false, res);
        const messages = [];

        for (const name of Object.keys(repos)) {
            messages.push({type: 'build-package-versions-cache', packageName: repos[name].getPackageName()});
        }

        await this.queue.sendBatch(messages);

        return repos;
    }

    /**
     * Refresh the cache of packages.
     *
     * @param {string}   url   The repository url
     * @param {Response} [res] The response
     *
     * @return {Promise<VcsRepository>}
     *
     * @throws RepositoryNotSupportedError When the repository is not supported
     * @throws RepositoryNotFoundError     When the repository is not found
     */
    public async refreshCachePackages(url: string, res?: Response): Promise<VcsRepository> {
        const repo = await this.repoManager.getRepository(url, true, res) as VcsRepository;

        await this.queue.send({type: 'build-package-versions-cache', packageName: repo.getPackageName()});

        return repo;
    }

    /**
     * Track the download of the package version.
     *
     * @param {string}   packageName The package name
     * @param {string}   version     The version
     * @param {Response} [res]       The response
     *
     * @return {Promise<void>}
     */
    public async trackDownload(packageName: string, version: string, res?: Response): Promise<void> {
        const repo = await this.repoManager.findRepository(packageName, res);
        const pack = await this.findPackage(packageName, version, res);

        if (repo && pack) {
            repo.addDownloadCount();
            pack.addDownloadCount();
            await this.update(pack);
            await this.repoManager.update(repo);
        }
    }
}
