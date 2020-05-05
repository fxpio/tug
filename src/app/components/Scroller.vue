<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="scroller">
        <slot name="default"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Scroller as AppScroller} from '@app/scroller/Scroller';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class Scroller extends Vue {
        @Prop({type: Object})
        public options: OverlayScrollbars.Options;

        private scrollbar: AppScroller;

        public mounted(): void {
            this.scrollbar = new AppScroller(this.$el as HTMLElement, this.options);
        }

        public destroyed(): void {
            this.scrollbar.destroy();
        }
    }
</script>
