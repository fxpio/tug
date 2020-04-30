/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Formatter} from './Formatter';

/**
 * Validator vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue, options?: Formatter): void => {
        Vue.prototype.$formatter = options;
        Vue.prototype.$fd = (value?: string, format?: string): string|undefined => {
            return (options as Formatter).date(value, format);
        };
        Vue.prototype.$ft = (value?: string, format?: string): string|undefined => {
            return (options as Formatter).time(value, format);
        };
        Vue.prototype.$fdt = (value?: string, format?: string): string|undefined => {
            return (options as Formatter).dateTime(value, format);
        };
    },
} as PluginObject<Formatter>;
