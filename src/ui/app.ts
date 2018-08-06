/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {apiAddAuthInterceptor, apiAddAuthRedirectInterceptor, apiAddLocaleInterceptor, VueApi} from '@app/ui/api';
import {Api} from '@app/ui/api/Api';
import '@app/ui/class-component-hooks';
import {App} from '@app/ui/components/App';
import '@app/ui/components/Loading';
import {createRouter, routerAddAuthGuard} from '@app/ui/router';
import {createStore} from '@app/ui/store';
import '@app/ui/styles/app.styl';
import {RootState} from '@app/ui/stores/RootState';
import translationEn from '@app/ui/translations/en';
import translationFr from '@app/ui/translations/fr';
import vuetifyTranslationFr from '@app/ui/translations/vuetify/fr';
import {AppContext} from '@app/ui/utils/AppContext';
import 'babel-polyfill';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import {install as offlinePluginInstall} from 'offline-plugin/runtime';
import VeeValidate, {Validator} from 'vee-validate';
import veeValidateFr from 'vee-validate/dist/locale/fr';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Meta from 'vue-meta';
import Vuetify from 'vuetify';

/**
 *  Create the app.
 *
 * @param {object} context
 * @return {Vue}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createApp(context: AppContext): Vue {
    let apiClient = new Api(context.apiBaseUrl);

    Vue.use(VueI18n);
    Vue.use(Meta);
    Vue.use(VueApi.plugin, apiClient);
    Vue.use(VeeValidate);
    Vue.use(Vuetify, {
        theme: {
            primary: "#546E7A",
            secondary: "#78909C",
            accent: "#1E88E5",
            error: "#f44336",
            warning: "#F9A825",
            info: "#4FC3F7",
            success: "#4caf50"
        },
        lang: {
            locales: {
                fr: vuetifyTranslationFr
            }
        }
    });

    let i18n = new VueI18n({
        locale: 'en',
        fallbackLocale: 'en',
        missing: (locale, key) => {
            console.warn(`I18n :: Key "${key}" is missing for locale "${locale}"`);
        },
        messages: {
            en: translationEn,
            fr: translationFr,
        }
    });
    let router = createRouter();
    let store = createStore<RootState>(router, i18n, apiClient);

    offlinePluginInstall();
    routerAddAuthGuard(router, store);
    apiAddLocaleInterceptor(apiClient, store);
    apiAddAuthInterceptor(apiClient, store);
    apiAddAuthRedirectInterceptor(apiClient, store);
    Validator.localize('fr', veeValidateFr);

    return new Vue({
        i18n,
        router,
        store,
        render: h => h(App)
    });
}
