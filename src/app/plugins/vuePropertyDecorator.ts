/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Component.registerHooks([
  'metaInfo',
  'beforeRouteEnter',
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
