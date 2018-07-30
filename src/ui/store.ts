/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import {RootState} from '@app/ui/states/RootState';
import Router from 'vue-router';
import {AxiosBasicCredentials, AxiosInstance} from 'axios';

Vue.use(Vuex);

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

/**
 * Create the router.
 *
 * @param {Router}        router
 * @param {AxiosInstance} api
 *
 * @return {Store<RootState>}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createStore(router: Router, api: AxiosInstance): Store<RootState> {
    return new Vuex.Store<RootState>({
        state: {
            isAuthenticated: !!localStorage.getItem('token'),
            authenticationPending: false,
            authToken: localStorage.getItem('token'),
            showDrawer: null === localStorage.getItem('showDrawer') ? true : 'true' === (localStorage.getItem('showDrawer'))
        } as RootState,
        mutations: {
            [LOGIN] (state: RootState): void {
                state.authenticationPending = true;
            },
            [LOGIN_SUCCESS] (state) {
                state.isAuthenticated = true;
                state.authenticationPending = false;
            },
            [LOGIN_ERROR] (state) {
                state.isAuthenticated = false;
                state.authenticationPending = false;
            },
            [LOGOUT] (state: RootState): void {
                state.isAuthenticated = false;
            },
            [TOGGLE_DRAWER] (state: RootState, show: boolean): void {
                state.showDrawer = show;
                localStorage.setItem('showDrawer', state.showDrawer ? 'true' : 'false');
            }
        },
        actions: {
            async login({ commit, state }, credentials: AxiosBasicCredentials) {
                commit(LOGIN);

                try {
                    let redirect = router.currentRoute.query.redirect;
                    let res = await api.put('/authorizations', credentials, {auth: credentials});
                    state.authToken = res.data.token;
                    localStorage.setItem('token', state.authToken as string);
                    commit(LOGIN_SUCCESS);

                    if (redirect) {
                        router.replace(redirect);
                    } else {
                        router.replace({name: 'home', params: {locale: state.i18n.locale}});
                    }
                } catch (e) {
                    commit(LOGIN_ERROR);
                    throw e;
                }
            },
            logout({ commit, state }) {
                state.authToken = null;
                localStorage.removeItem('token');
                commit(LOGOUT);
                router.replace({name: 'login', params: {
                    locale: state.i18n.locale},
                    query: {redirect: router.currentRoute.fullPath}
                });
            }
        },
        getters: {
            isAuthenticationPending: state => state.authenticationPending,
            isAuthenticated: state => state.isAuthenticated
        }
    });
}
