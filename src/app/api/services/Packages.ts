/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from '../BaseService';
import {Canceler} from '../Canceler';
import {PackagesResponse} from '@app/api/models/responses/PackagesResponse';
import {PackageRefreshRequest} from '@app/api/models/requests/PackageRefreshRequest';
import {PackageRefreshResponse} from '@app/api/models/responses/PackageRefreshResponse';
import {PackageRefreshCacheRequest} from '@app/api/models/requests/PackageRefreshCacheRequest';
import {PackageCacheRefreshResponse} from '@app/api/models/responses/PackageCacheRefreshResponse';
import {PackageDeleteRequest} from '@app/api/models/requests/PackageDeleteRequest';
import {PackageDeleteResponse} from '@app/api/models/responses/PackageDeleteResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Packages extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Packages';
    }

    /**
     * Get all the package versions.
     *
     * Note: The API returns a 404 error status code if no package is found.
     */
    public async getAll(packageName: string, canceler?: Canceler): Promise<PackagesResponse> {
        return await this.request<PackagesResponse>({
            method: 'GET',
            url: '/manager/packages/' + packageName + '/versions',
        }, canceler) as PackagesResponse;
    }

    /**
     * Refresh all packages of all repositories.
     */
    public async refreshAll(force: boolean = false, canceler?: Canceler): Promise<PackageRefreshResponse> {
        return await this.refresh({
            force,
        }, canceler);
    }

    /**
     * Refresh all packages of a repository.
     */
    public async refreshOne(url: string, force: boolean = false, canceler?: Canceler): Promise<PackageRefreshResponse> {
        return await this.refresh({
            url,
            force,
        }, canceler);
    }

    /**
     * Refresh a single package of a repository.
     */
    public async refreshOneVersion(url: string, version: string, force: boolean = false, canceler?: Canceler): Promise<PackageRefreshResponse> {
        return await this.refresh({
            url,
            version,
            force,
        }, canceler);
    }

    /**
     * Refresh all packages or a single package of a repository.
     */
    public async refresh(data: PackageRefreshRequest,
                         canceler?: Canceler): Promise<PackageRefreshResponse> {
        return await this.request<PackageRefreshResponse>({
            method: 'PUT',
            url: '/manager/packages/refresh',
            data,
        }, canceler) as PackageRefreshResponse;
    }

    /**
     * Refresh only the cache for all packages of all repositories.
     */
    public async refreshCacheAll(canceler?: Canceler): Promise<PackageCacheRefreshResponse> {
        return await this.refreshCache({}, canceler);
    }

    /**
     * Refresh only the cache for all packages of a repository.
     */
    public async refreshCacheOne(url: string, canceler?: Canceler): Promise<PackageCacheRefreshResponse> {
        return await this.refreshCache({
            url,
        }, canceler);
    }

    /**
     * Refresh only the cache for all packages or a single package of a repository.
     */
    public async refreshCache(data: PackageRefreshCacheRequest,
                              canceler?: Canceler): Promise<PackageCacheRefreshResponse> {
        return await this.request<PackageCacheRefreshResponse>({
            method: 'PUT',
            url: '/manager/packages/refresh-all',
            data,
        }, canceler) as PackageCacheRefreshResponse;
    }

    /**
     * Delete all packages of a repository.
     */
    public async deleteAll(url: string, canceler: Canceler): Promise<PackageDeleteResponse> {
        return await this.delete({
            url,
        }, canceler);
    }

    /**
     * Delete a single package of a repository.
     */
    public async deleteVersion(url: string, version: string, canceler: Canceler): Promise<PackageDeleteResponse> {
        return await this.delete({
            url,
            version,
        }, canceler);
    }

    /**
     * Delete all packages or a single package of a repository.
     */
    public async delete(data: PackageDeleteRequest,
                        canceler?: Canceler): Promise<PackageDeleteResponse> {
        return await this.request<PackageDeleteResponse>({
            method: 'DELETE',
            url: '/manager/packages',
            data,
        }, canceler) as PackageDeleteResponse;
    }
}
