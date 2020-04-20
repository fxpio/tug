/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from './Api';
import {AxiosError, AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';
import {I18nModuleState} from '@app/stores/i18n/I18nModuleState';
import {AuthModuleState} from '@app/stores/auth/AuthModuleState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class ApiInterceptors {
    /**
     * Add the locale interceptor.
     *
     * @param {Api}              apiClient
     * @param {Store<RootState>} store
     *
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    public static addLocaleInterceptor(apiClient: Api, store: Store<I18nModuleState>): void {
        apiClient.addRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
            config.headers['Accept-Language'] = store.state.i18n.locale;

            return config;
        });
    }

    /**
     * Add the auth interceptor.
     *
     * @param {Api}              apiClient
     * @param {Store<RootState>} store
     *
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    public static addAuthInterceptor(apiClient: Api, store: Store<AuthModuleState>): void {
        apiClient.addRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
            if (!config.auth && !config.headers.Authorization && store.state.auth.token) {
                config.headers.Authorization = `token ${store.state.auth.token}`;
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
     * @param {Api}        apiClient
     * @param {Store<any>} store
     *
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    public static addAuthRedirectInterceptor(apiClient: Api, store: Store<any>): void {
        apiClient.addResponseInterceptor(undefined, async (error: AxiosError) => {
            if (error.response && 401 === error.response.status && !error.config.auth) {
                await store.dispatch('auth/logout');
                return;
            }

            return Promise.reject(error);
        });
    }
}
