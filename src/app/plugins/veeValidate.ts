/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import VeeValidate, {Validator} from 'vee-validate';
import veeValidateFr from 'vee-validate/dist/locale/fr';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(VeeValidate);

Validator.localize('fr', veeValidateFr);
