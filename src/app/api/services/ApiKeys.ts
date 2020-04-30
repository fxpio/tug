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
import {ListOptions} from '../models/requests/ListOptions';
import {ApiKey} from '../models/responses/ApiKey';
import {ApiKeyRequest} from '../models/requests/ApiKeyRequest';
import {ApiKeyResponse} from '../models/responses/ApiKeyResponse';
import {ListResponse} from '../models/responses/ListResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ApiKeys extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'ApiKeys';
    }

    /**
     * Get or create the authorization.
     *
     * @param {ListOptions} [options]
     * @param {Canceler}    [canceler]
     *
     * @return {Promise<ListResponse<ApiKey>>}
     */
    public async list(options?: ListOptions, canceler?: Canceler): Promise<ListResponse<ApiKey>> {
        return this.requestList<ApiKey>({url: '/manager/api-keys', params: options || {}}, canceler);
    }

    public async create(data: ApiKeyRequest,
                        canceler?: Canceler): Promise<ApiKeyResponse> {
        return await this.request<ApiKeyResponse>({
            method: 'POST',
            url: '/manager/api-keys',
            data,
        }, canceler) as ApiKeyResponse;
    }

    public async delete(data: ApiKeyRequest,
                        canceler?: Canceler): Promise<ApiKeyResponse> {
        return await this.request<ApiKeyResponse>({
            method: 'DELETE',
            url: '/manager/api-keys',
            data,
        }, canceler) as ApiKeyResponse;
    }
}
