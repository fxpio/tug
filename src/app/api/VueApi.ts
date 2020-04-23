/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from './Api';
import _Vue, {PluginObject} from 'vue';

/**
 * Api vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue, options?: Api): void => {
        Vue.prototype.$api = options;
    },
} as PluginObject<Api>;
