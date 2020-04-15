/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {createApp} from '@app/app';

const context = {
    apiBaseUrl: `${window.location.protocol}//${window.location.host}`
};

createApp(context).$mount('#app');
