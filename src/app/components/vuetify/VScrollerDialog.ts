/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {ComponentOptions} from 'vue';
import {VDialog} from 'vuetify/lib';
import {Scroller} from '@app/scroller/Scroller';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const base = Vue.extend({
    mixins: [VDialog as ComponentOptions<Vue>],
});

interface Options extends InstanceType<typeof base> {
    scroller?: Scroller;
}

// @ts-ignore
export default base.extend<Options>().extend({
    name: 'v-scroller-dialog',
    props: {
        // Update the default value to fix the bug between bounce effect and overlay scrollbars
        noClickAnimation: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            scroller: null,
        };
    },
    created() {
        const prevBind = this.bind;
        const prevUnbind = this.unbind;

        this.bind = (): any => {
            const res = prevBind();
            this.scroller = new Scroller(this.$refs.dialog);

            return res;
        };
        this.unbind = (): any => {
            const res = prevUnbind();

            if (this.scroller) {
                this.$refs.dialog.style.overflow = 'hidden';
                this.scroller.destroy();
                this.scroller = undefined;
            }

            return res;
        };
    },
    destroyed() {
        if (this.scroller) {
            this.scroller.destroy();
        }
    },
});
