/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@app/api/Api';
import {AuthModule} from '@app/stores/auth/AuthModule';
import {DrawerModule} from '@app/stores/drawer/DrawerModule';
import {I18nModule} from '@app/stores/i18n/I18nModule';
import {RootState} from '@app/stores/RootState';
import {SnackbarModule} from '@app/stores/snackbar/SnackbarModule';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Router from 'vue-router';
import Vuex, {Store} from 'vuex';

Vue.use(Vuex);

/**
 * Create the router.
 *
 * @param {Router}  router
 * @param {VueI18n} i18n
 * @param {Api}     api
 *
 * @return {Store<RootState>}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createStore<R extends RootState>(router: Router, i18n: VueI18n, api: Api): Store<R> {
    return new Vuex.Store<R>({
        state: <R> {},
        modules: {
            i18n: new I18nModule<R>(router, i18n),
            auth: new AuthModule<R>(router, api),
            drawer: new DrawerModule<R>(),
            snackbar: new SnackbarModule<R>(),
        }
    });
}
