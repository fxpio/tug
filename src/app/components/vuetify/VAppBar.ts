/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {ComponentOptions} from 'vue';
import {VAppBar} from 'vuetify/lib';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const base = Vue.extend({
    mixins: [VAppBar as ComponentOptions<Vue>],
});

export default base.extend().extend({
    name: 'v-scroller-app-bar',
    watch: {
        scrollTarget(newVal: string|null) {
            if (this.target) {
                this.target.removeEventListener('scroll', this.onScroll);
            }

            this.target = newVal ? document.querySelector(newVal) : null;
            this.scroller = !!this.target;

            if (this.target) {
                this.target.addEventListener('scroll', this.onScroll);
            }
        },
    },
    data() {
        return {
            scroller: false,
        };
    },
    destroyed() {
        if (this.scroller && this.target) {
            this.target.removeEventListener('scroll', this.onScroll);
        }
    },
});
