/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue from 'vue';
import {PluginObject} from 'vue';
import {createLongClickMixin, LongClickOptions} from '@app/mixins/longClick';

/**
 * Long click vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    install: (Vue: typeof _Vue, options?: LongClickOptions): void => {
        Vue.mixin(createLongClickMixin(options));
    },
} as PluginObject<LongClickOptions>;
