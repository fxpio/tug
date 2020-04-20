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
import {AuthModuleState} from '@app/stores/auth/AuthModuleState';
import {DarkModeModule} from '@app/stores/darkMode/DarkModeModule';
import {DarkModeModuleState} from '@app/stores/darkMode/DarkModeModuleState';
import {DrawerModule} from '@app/stores/drawer/DrawerModule';
import {DrawerModuleState} from '@app/stores/drawer/DrawerModuleState';
import {I18nModule} from '@app/stores/i18n/I18nModule';
import {I18nModuleState} from '@app/stores/i18n/I18nModuleState';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import Vuex, {Store} from 'vuex';

Vue.use(Vuex);

/**
 * Create the router.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createStore<R extends AuthModuleState
    & DarkModeModuleState
    & DrawerModuleState
    & I18nModuleState>(router: VueRouter,
                       i18n: VueI18n,
                       api: Api): Store<R> {
    return new Vuex.Store<R>({
        state: {} as R,
        modules: {
            auth: new AuthModule<R>(router, api),
            darkMode: new DarkModeModule<R>(),
            drawer: new DrawerModule<R>(),
            i18n: new I18nModule<R>(i18n),
        },
    });
}
