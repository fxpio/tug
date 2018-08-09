/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RootState} from '@app/ui/stores/RootState';
import Vue from 'vue';
import Router from 'vue-router';
import {Route} from 'vue-router/types/router';
import {Store} from 'vuex';

Vue.use(Router);

/**
 * Create the router.
 *
 * @return {Router}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createRouter(): Router {
    return new Router({
        mode: 'history',
        base: '/admin/',
        routes: [
            {   path: '',
                redirect: 'home'
            },
            {   path: '/home',
                name: 'home',
                meta: {requiresAuth: true},
                components: {
                    default: () => import('@app/ui/pages/Home').then(({ Home }) => Home),
                    toolbar: () => import('@app/ui/components/Toolbar').then(({ Toolbar }) => Toolbar),
                }
            },
            {   path: '/login',
                name: 'login',
                component: () => import('@app/ui/pages/Login').then(({ Login }) => Login)
            },
            {   path: '/repositories',
                name: 'repositories',
                meta: {requiresAuth: true},
                components: {
                    default: () => import('@app/ui/pages/Repositories').then(({ Repositories }) => Repositories),
                    toolbar: () => import('@app/ui/components/Toolbar').then(({ Toolbar }) => Toolbar),
                },
            },
            {   path: "*",
                name: 'error404',
                components: {
                    default: () => import('@app/ui/components/Error404').then(({ Error404 }) => Error404),
                    toolbar: () => import('@app/ui/components/Toolbar').then(({ Toolbar }) => Toolbar),
                }
            }
        ]
    });
}

/**
 * Add the auth router guard.
 *
 * @param {VueRouter}        router
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function routerAddAuthGuard(router: Router, store: Store<RootState>): void {
    router.beforeEach((to: Route, from: Route, next: Function) => {
        let guard = undefined;

        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!store.getters['auth/isAuthenticated']) {
                guard = {
                    name: 'login',
                    params: {
                        locale: store.state.i18n.locale
                    },
                    query: {
                        redirect: to.fullPath,
                    },
                };
            }
        }

        next(guard);
    });
}
