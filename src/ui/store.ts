/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@app/ui/api/Api';
import {AuthModule} from '@app/ui/stores/auth/AuthModule';
import {DrawerModule} from '@app/ui/stores/drawer/DrawerModule';
import {RootState} from '@app/ui/stores/RootState';
import Vue from 'vue';
import Router from 'vue-router';
import Vuex, {Store} from 'vuex';

Vue.use(Vuex);

/**
 * Create the router.
 *
 * @param {Router} router
 * @param {Api}    api
 *
 * @return {Store<RootState>}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createStore<R extends RootState>(router: Router, api: Api): Store<R> {
    return new Vuex.Store<R>({
        state: <R> {},
        modules: {
            auth: new AuthModule<R>(router, api),
            drawer: new DrawerModule<R>()
        }
    });
}
