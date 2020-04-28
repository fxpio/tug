/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ApiService} from './ApiService';
import {Canceler} from './Canceler';
import {createApiError} from './utils/error';
import {ListResponse} from './models/responses/ListResponse';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BaseService implements ApiService {
    protected readonly axios: AxiosInstance;

    /**
     * Constructor.
     *
     * @param {AxiosInstance} axios
     */
    constructor(axios: AxiosInstance) {
        this.axios = axios;
    }

    /**
     * Build and run the request.
     *
     * @param {AxiosRequestConfig} config
     * @param {Canceler}           [canceler]
     *
     * @return {Promise<T|null>}
     */
    protected async request<T>(config: AxiosRequestConfig, canceler?: Canceler): Promise<T | null> {
        if (canceler) {
            config.cancelToken = new axios.CancelToken(function executor(c) {
                canceler.setExecutor(c);
            });
        }

        try {
            const res = await this.axios.request(config);

            return res ? res.data : null;
        } catch (e) {
            if (!axios.isCancel(e)) {
                throw createApiError(e);
            }
        }

        return null;
    }

    /**
     * Build and run the request.
     *
     * @param {AxiosRequestConfig} config
     * @param {Canceler}           [canceler]
     *
     * @return {Promise<ListResponse<T>>}
     */
    protected async requestList<T>(config: AxiosRequestConfig, canceler?: Canceler): Promise<ListResponse<T>> {
        if (!config.method) {
            config.method = 'GET';
        }

        const res = await this.request<ListResponse<T>>(config, canceler);

        return res ? res : {results: [], count: 0, lastId: null} as ListResponse<T>;
    }
}
