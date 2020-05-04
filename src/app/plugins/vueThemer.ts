/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Store} from 'vuex';
import VueThemer from '@app/themer/VueThemer';
import {Themer} from '@app/themer/Themer';
import {DarkModeModuleState} from '@app/stores/darkMode/DarkModeModuleState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */

export function createThemer(store: Store<DarkModeModuleState>): Themer {
    const themer = new Themer(store);
    Vue.use(VueThemer, themer);

    return themer;
}
