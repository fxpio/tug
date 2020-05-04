/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Themer} from './Themer';
import {ThemerClasses} from './ThemerClasses';

/**
 * Validator vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue, options?: Themer): void => {
        Vue.prototype.$themer = options;
        Vue.prototype.$classes = (classes: Array<ThemerClasses|string>|ThemerClasses|string, darkClasses?: ThemerClasses|string) => {
            if (Array.isArray(classes)) {
                darkClasses = undefined !== classes[1] ? classes[1] : undefined;
                classes = undefined !== classes[0] ? classes[0] : '';
            }

            return (options as Themer).classes(classes, darkClasses);
        };
        Vue.prototype.$color = (color: Array<string|undefined>|string, darkColor?: string) => {
            if (Array.isArray(color)) {
                darkColor = undefined !== color[1] ? color[1] : undefined;
                color = undefined !== color[0] ? color[0] : '';
            }

            return (options as Themer).color(color, darkColor);
        };
    },
} as PluginObject<Themer>;
