/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import VueValidator from '@app/validator/VueValidator';
import {I18nValidator} from '@app/validator/I18nValidator';
import {RequiredRule} from '@app/validator/rules/RequiredRule';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const validator = new I18nValidator([
    new RequiredRule(),
]);

Vue.use(VueValidator, validator);

export default validator;
