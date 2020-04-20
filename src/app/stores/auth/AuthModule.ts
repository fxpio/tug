/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@app/api/Api';
import {AuthorizationRequest} from '@app/api/models/requests/AuthorizationRequest';
import {Authorization} from '@app/api/services/Authorization';
import {AuthState} from './AuthState';
import {I18nModuleState} from '@app/stores/i18n/I18nModuleState';
import Router from 'vue-router';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {Canceler} from '@app/api/Canceler';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AuthModule<R extends I18nModuleState> implements Module<AuthState, R> {
    private readonly router: Router;

    private readonly api: Api;

    private previousRequest?: Canceler;

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
            token: localStorage.getItem('auth:token'),
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
        const self = this;

        return {
            async login({commit, state, rootState}, credentials: AuthorizationRequest): Promise<void> {
                commit('login');

                try {
                    self.cancelPreviousRequest();
                    self.previousRequest = new Canceler();
                    const redirect = self.router.currentRoute.query.redirect;
                    const res = await self.api.get<Authorization>(Authorization).get(credentials, self.previousRequest);
                    state.token = res ? res.token : null;
                    localStorage.setItem('auth:token', state.token as string);
                    commit('loginSuccess');
                    self.previousRequest = undefined;

                    if (redirect) {
                        await self.router.replace(redirect as string);
                    } else {
                        await self.router.replace({name: 'home', params: {locale: rootState.i18n.locale}});
                    }
                } catch (e) {
                    commit('loginError');
                    self.previousRequest = undefined;
                    throw e;
                }
            },
            async logout({commit, state, rootState}): Promise<void> {
                state.token = null;
                localStorage.removeItem('auth:token');
                commit('logout');
                await self.router.replace({
                    name: 'login', params: {locale: rootState.i18n.locale},
                    query: {redirect: self.router.currentRoute.fullPath},
                });
            },

            async cancel(): Promise<void> {
                self.cancelPreviousRequest();
            },
        };
    }

    protected cancelPreviousRequest(): void {
        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }
}
