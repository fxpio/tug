/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'core-js/stable';
import '@app/plugins/vuePropertyDecorator';
import ApiInterceptors from '@app/api/ApiInterceptors';
import {useVueRouterBackPlugin} from '@app/plugins/vueRouterBack';
import RouterGuards from '@app/routers/RouterGuards';
import {RootState} from '@app/stores/RootState';
import Vue from 'vue';
import '@app/plugins/vueMeta';
import vuetify from '@app/plugins/vuetify';
import '@app/plugins/vueLongClick';
import '@app/plugins/vueJsonViewer';
import i18n from '@app/plugins/vueI18n';
import validator from '@app/plugins/vueValidator';
import formatter from '@app/plugins/vueFormatter';
import apiClient from '@app/plugins/vueApi';
import '@app/plugins/vueSnackbar';
import App from '@app/App.vue';
import router from '@app/router';
import {createStore} from '@app/store';
import {createThemer} from '@app/plugins/vueThemer';
import '@app/registerServiceWorker';
import '@app/styles/fonts.scss';
import '@app/styles/app.scss';
import SimpleSpacer from '@app/components/SimpleSpacer.vue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.config.productionTip = false;
useVueRouterBackPlugin({router, forceHistory: true});

const store = createStore<RootState>(router, i18n, apiClient);
createThemer(store);
validator.setI18n(i18n);
formatter.setI18n(i18n);

RouterGuards.addAuthGuard(router, store);
RouterGuards.addDefaultComponentGuard(router, 'toolbar', SimpleSpacer);

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
