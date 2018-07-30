/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@app/ui/api/Api';
import {RootState} from '@app/ui/states/RootState';
import {AxiosError, AxiosRequestConfig} from 'axios';
import _Vue, {PluginObject} from 'vue';
import {Store} from 'vuex';

/**
 * Api vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VueApi
{
    public static get plugin(): PluginObject<Api> {
        return {
            install: (Vue: typeof _Vue, options?: Api): void => {
                Vue.prototype.$api = options;
            }
        };
    }
}

/**
 * Add the locale interceptor.
 *
 * @param {Api}              apiClient
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function apiAddLocaleInterceptor(apiClient: Api, store: Store<RootState>): void {
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
export function apiAddAuthInterceptor(apiClient: Api, store: Store<RootState>): void {
    apiClient.addRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
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
 * @param {Api}              apiClient
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function apiAddAuthRedirectInterceptor(apiClient: Api, store: Store<RootState>): void {
    apiClient.addResponseInterceptor(undefined, async (error: AxiosError) => {
        if (error.response && 401 === error.response.status && !error.config.auth) {
            await store.dispatch('logout');
            return;
        }

        return Promise.reject(error);
    });
}
