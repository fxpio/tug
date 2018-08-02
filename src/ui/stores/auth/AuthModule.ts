/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@app/ui/api/Api';
import {AuthorizationRequest} from '@app/ui/api/models/requests/AuthorizationRequest';
import {Authorization} from '@app/ui/api/services/Authorization';
import {AuthState} from '@app/ui/stores/auth/AuthState';
import {I18nModuleState} from '@app/ui/stores/i18n/I18nModuleState';
import Router from 'vue-router';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AuthModule<R extends I18nModuleState> implements Module<AuthState, R>
{
    private readonly router: Router;
    private readonly api: Api;

    /**
     * Constructor.
     *
     * @param router The router
     * @param api    The api
     */
    public constructor(router: Router, api: Api) {
        this.router = router;
        this.api = api;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): AuthState {
        return {
            authenticated: !!localStorage.getItem('auth:token'),
            authenticationPending: false,
            token: localStorage.getItem('auth:token')
        };
    }

    public get getters(): GetterTree<AuthState, R> {
        return {
            isAuthenticationPending(state: AuthState): boolean {
                return state.authenticationPending;
            },
            isAuthenticated(state: AuthState): boolean {
                return state.authenticated;
            },
        };
    }

    public get mutations(): MutationTree<AuthState> {
        return {
            login(state: AuthState): void {
                state.authenticationPending = true;
            },
            loginSuccess(state: AuthState): void {
                state.authenticated = true;
                state.authenticationPending = false;
            },
            loginError(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
            },
            logout(state: AuthState): void {
                state.authenticated = false;
            },
        };
    }

    public get actions(): ActionTree<AuthState, R> {
        let self = this;

        return {
            async login({ commit, state, rootState }, credentials: AuthorizationRequest): Promise<void> {
                commit('login');

                try {
                    let redirect = self.router.currentRoute.query.redirect;
                    let res = await self.api.get<Authorization>(Authorization).get(credentials);
                    state.token = res.token;
                    localStorage.setItem('auth:token', state.token as string);
                    commit('loginSuccess');

                    if (redirect) {
                        self.router.replace(redirect);
                    } else {
                        self.router.replace({name: 'home', params: {locale: rootState.i18n.locale}});
                    }
                } catch (e) {
                    commit('loginError');
                    throw e;
                }
            },
            logout({ commit, state, rootState }): void {
                state.token = null;
                localStorage.removeItem('auth:token');
                commit('logout');
                self.router.replace({name: 'login', params: {
                    locale: rootState.i18n.locale},
                    query: {redirect: self.router.currentRoute.fullPath}
                });
            }
        };
    }
}
