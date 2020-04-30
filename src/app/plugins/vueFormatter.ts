/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import VueFormatter from '@app/formatter/VueFormatter';
import {Formatter} from '@app/formatter/Formatter';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const formatter = new Formatter();

Vue.use(VueFormatter, formatter);

export default formatter;
