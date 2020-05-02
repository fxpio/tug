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
