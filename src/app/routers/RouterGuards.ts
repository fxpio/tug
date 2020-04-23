/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthModuleState} from '@app/stores/auth/AuthModuleState';
import {I18nModuleState} from '@app/stores/i18n/I18nModuleState';
import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RouterGuards {
    /**
     * Add the auth router guard.
     */
    public static addAuthGuard(router: Router, store: Store<AuthModuleState & I18nModuleState>): void {
        router.beforeEach(async (to: Route, from: Route,
                                 next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
            let guard;

            if (to.matched.some((record) => record.meta.requiresAuth)) {
                if (!store.state.auth.authenticated) {
                    guard = {
                        name: 'login',
                        params: {
                            locale: store.state.i18n.locale,
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

    /**
     * Add the default component in the current route if it is not defined.
     */
    public static addDefaultComponentGuard(router: Router, name: string, component: any): void {
        router.beforeEach(async (to: Route, from: Route,
                                 next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
            to.matched.forEach((record) => {
                if (undefined === record.components[name]) {
                    record.components.toolbar = component as any;
                }
            });

            next();
        });
    }
}
