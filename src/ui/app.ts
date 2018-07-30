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
import {createRouter, routerAddAuthGuard, routerAddLocaleGuard} from '@app/ui/router';
import {createStore} from '@app/ui/store';
import '@app/ui/styles/app.styl';
import translationEn from '@app/ui/translations/en';
import translationFr from '@app/ui/translations/fr';
import {AppContext} from '@app/ui/utils/AppContext';
import 'babel-polyfill';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import VeeValidate, {Validator} from 'vee-validate';
import veeValidateFr from 'vee-validate/dist/locale/fr';
import Vue from 'vue';
import Meta from 'vue-meta';
import Vuetify from 'vuetify';
import VuexI18n from 'vuex-i18n';

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
    let router = createRouter();
    let store = createStore(router, apiClient);

    routerAddLocaleGuard(router, store);
    routerAddAuthGuard(router, store);
    apiAddLocaleInterceptor(apiClient, store);
    apiAddAuthInterceptor(apiClient, store);
    apiAddAuthRedirectInterceptor(apiClient, store);
    Validator.localize('fr', veeValidateFr);

    Vue.use(Meta);
    Vue.use(VueApi.plugin, apiClient);
    Vue.use(VeeValidate);
    Vue.use(VuexI18n.plugin, store, {
        onTranslationNotFound: function(locale: string, key: string): void {
            console.warn(`vuex-i18n :: Key '${key}' not found for locale '${locale}'`);
        }
    });
    Vue.use(Vuetify, {
        theme: {
            primary: "#546E7A",
            secondary: "#78909C",
            accent: "#1E88E5",
            error: "#f44336",
            warning: "#F9A825",
            info: "#4FC3F7",
            success: "#4caf50"
        }
    });

    Vue.i18n.fallback('en');
    Vue.i18n.set('en');
    Vue.i18n.add('en', translationEn);
    Vue.i18n.add('fr', translationFr);

    return new Vue({
        router,
        store,
        render: h => h(App)
    });
}
