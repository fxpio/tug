/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'core-js/stable';
import '@app/registerHooks';
import ApiInterceptors from '@app/api/ApiInterceptors';
import {useVueRouterBackPlugin} from '@app/plugins/vueRouterBack';
import RouterGuards from '@app/routers/RouterGuards';
import {RootState} from '@app/stores/RootState';
import Vue from 'vue';
import '@app/plugins/veeValidate';
import '@app/plugins/vueMeta';
import vuetify from '@app/plugins/vuetify';
import '@app/plugins/vueLongClick';
import i18n from '@app/plugins/vueI18n';
import apiClient from '@app/plugins/vueApi';
import '@app/plugins/vueSnackbar';
import App from '@app/App.vue';
import router from '@app/router';
import {createStore} from '@app/store';
import '@app/registerServiceWorker';
import '@app/styles/fonts.scss';
import '@app/styles/app.scss';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.config.productionTip = false;
useVueRouterBackPlugin({router, forceHistory: true});

const store = createStore<RootState>(router, i18n, apiClient);

RouterGuards.addAuthGuard(router, store);

ApiInterceptors.addLocaleInterceptor(apiClient, store);
ApiInterceptors.addAuthInterceptor(apiClient, store);
ApiInterceptors.addAuthRedirectInterceptor(apiClient, store);

new Vue({
    i18n,
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
