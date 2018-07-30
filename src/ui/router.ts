/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import Router from 'vue-router';
import {Error404} from '@app/ui/components/Error404';
import {Route} from 'vue-router/types/router';
import {Validator} from 'vee-validate';
import {Store} from 'vuex';
import {RootState} from '@app/ui/states/RootState';

Vue.use(Router);

/**
 * Create the router.
 *
 * @return {Router}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createRouter(): Router {
    return  new Router({
        mode: 'history',
        base: '/admin/',
        routes: [
            {   path: '/',
                redirect: 'home'
            },
            {   path: '/:locale',
                component: () => import('@app/ui/components/ChildRouteWrapper').then(({ ChildRouteWrapper }) => ChildRouteWrapper),
                children: [
                    {   path: '',
                        name: 'home',
                        meta: {requiresAuth: true},
                        component: () => import('@app/ui/pages/Home').then(({ Home }) => Home),
                    },
                    {   path: 'login',
                        name: 'login',
                        component: () => import('@app/ui/pages/Login').then(({ Login }) => Login)
                    },
                    {   path: "*",
                        name: 'error404',
                        component: Error404
                    }
                ]
            }
        ]
    });
}

/**
 * Add the locale router guard.
 *
 * @param {VueRouter}        router
 * @param {Store<RootState>} store
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function routerAddLocaleGuard(router: Router, store: Store<RootState>): void {
    router.beforeEach((to: Route, from: Route, next: Function) => {
        let locale = to.params.locale;

        if (!locale) {
            locale = store.state.i18n.fallback;
        }

        Vue.i18n.set(locale);
        Validator.localize(locale);
        router.app.$vuetify.lang.current = locale;
        next();
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
            if (!store.getters.isAuthenticated) {
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
