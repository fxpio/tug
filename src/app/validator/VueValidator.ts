/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Validator} from './Validator';

/**
 * Validator vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue, options?: Validator): void => {
        Vue.prototype.$validator = options;
        Vue.prototype.$r = (name: string): (value?: any) => boolean|string => {
            return (options as Validator).r(name);
        };
    },
} as PluginObject<Validator>;
