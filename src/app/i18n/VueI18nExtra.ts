/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CurrencyFormatter} from './CurrencyFormatter';
import {DateFormatter} from './DateFormatter';
import _Vue, {PluginObject} from 'vue';

/**
 * I18n extra vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue): void => {
        Vue.prototype.$fd = DateFormatter.format;

        Vue.prototype.$fc = function(value: number, currency?: string): string {
            return CurrencyFormatter.format(this as _Vue, value, currency);
        };
    },
} as PluginObject<any>;
