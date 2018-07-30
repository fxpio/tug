/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';
import {RootState} from '@app/ui/states/RootState';

/**
 * Create the api client.
 *
 * @param {string} baseUrl The base url
 *
 * @return {Router}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createApiClient(baseUrl: string): AxiosInstance {
    return axios.create({
        baseURL: baseUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

/**
 * Add the locale interceptor.
 *
 * @param {AxiosInstance}    apiClient
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function apiAddLocaleInterceptor(apiClient: AxiosInstance, store: Store<RootState>): void {
    apiClient.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
        config.headers['Accept-Language'] = store.state.i18n.locale;

        return config;
    });
}

/**
 * Add the auth interceptor.
 *
 * @param {AxiosInstance}    apiClient
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function apiAddAuthInterceptor(apiClient: AxiosInstance, store: Store<RootState>): void {
    apiClient.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
        if (!config.auth && !config.headers['Authorization'] && store.state.authToken) {
            config.headers['Authorization'] = `token ${store.state.authToken}`;
        }

        if (config.auth && 0 === Object.keys(config.auth as object).length) {
            config.auth = undefined;
        }

        return config;
    });
}


/**
 * Add the auth redirection interceptor.
 *
 * @param {AxiosInstance}    apiClient
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function apiAddAuthRedirectInterceptor(apiClient: AxiosInstance, store: Store<RootState>): void {
    apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
        if (error.response && 401 === error.response.status && !error.config.auth) {
            await store.dispatch('logout');
            return;
        }

        return Promise.reject(error);
    });
}
