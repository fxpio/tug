/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@app/api/Api';
import VueApi from '@app/api/VueApi';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const apiBaseUrl = VUE_APP_API_URL ?? `${window.location.protocol}//${window.location.host}`;
const apiClient = new Api(apiBaseUrl);

Vue.use(VueApi, apiClient);

export default apiClient;
