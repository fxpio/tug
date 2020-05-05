/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {ComponentOptions} from 'vue';
import {VNavigationDrawer} from 'vuetify/lib';
import {Scroller} from '@app/scroller/Scroller';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const base = Vue.extend({
    mixins: [VNavigationDrawer as ComponentOptions<Vue>],
});

export default base.extend().extend({
    name: 'v-scroller-navigation-drawer',
    data() {
        return {
            scroller: null,
        };
    },
    mounted() {
        const content = this.$el.getElementsByClassName('v-navigation-drawer__content')[0];
        this.scroller = new Scroller(content);
    },
    destroyed() {
        this.scroller.destroy();
    },
});
