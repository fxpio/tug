/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouterBack} from './RouterBack';
import {RouterBackOptions} from './RouterBackOptions';
import _Vue, {PluginObject} from 'vue';

/**
 * Router back vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue, options?: RouterBackOptions): void => {
        if (options) {
            Vue.prototype.$routerBack = new RouterBack(options);
        }
    },
} as PluginObject<RouterBackOptions>;
