<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="app-tooltip--wrapper" @click="hover = true" @mouseover="hover = true" @mouseleave="hover = false">
        <transition :name="transition">
            <span :class="classes" v-if="hover"><slot name="tooltip">{{ message }}</slot></span>
        </transition>
        <slot name="default"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class Tooltip extends Vue {
        @Prop({type: String, default: 'fade'})
        public transition: string;

        @Prop({type: String, default: 'top'})
        public position: string;

        @Prop({type: String, default: '.'})
        public message: string;

        public hover: boolean = false;

        public get classes(): object {
            return {
                'app-tooltip': true,
                'app-tooltip--top': this.position === 'top',
                'app-tooltip--bottom': this.position === 'bottom',
                'app-tooltip--left': this.position === 'left',
                'app-tooltip--right': this.position === 'right',
            };
        }
    }
</script>

<style lang="scss">
    @import '~vuetify/src/styles/styles';
    @import './../styles/variables';

    $tooltip-background-color: rgba(map-get($grey, 'darken-2'), 0.9) !default;
    $tooltip-text-color: map-get($shades, 'white') !default;
    $tooltip-border-radius: $border-radius-root !default;
    $tooltip-font-size: 14px !default;
    $tooltip-padding: 5px 16px !default;
    $tooltip-margin: 8px !default;
    $tooltip-max-width: 300px !default;
    $tooltip-z-index: 1000 !default;

    .app-tooltip {
        background: $tooltip-background-color;
        color: $tooltip-text-color;
        border-radius: $tooltip-border-radius;
        font-size: $tooltip-font-size;
        line-height: round($tooltip-font-size * 1.6);
        position: absolute;
        display: inline-block;
        padding: $tooltip-padding;
        text-transform: initial;
        pointer-events: none;
        width: max-content;
        max-width: $tooltip-max-width;
        z-index: $tooltip-z-index;

        &--wrapper {
            position: relative;
            display: inline-flex;
            align-content: center;
            justify-content: center;
        }

        &,
        &--top {
            bottom: 100%;
            margin-bottom: $tooltip-margin;
        }

        // reset default value
        &--bottom,
        &--left,
        &--right {
            bottom: inherit;
            margin-bottom: inherit;
        }

        &--bottom {
            top: 100%;
            margin-top: $tooltip-margin;
        }

        &--left,
        &--right {
            top: 0;
            margin-top: -25%;
        }

        &--left {
            right: 100%;
            margin-right: $tooltip-margin;
        }

        &--right {
            left: 100%;
            margin-left: $tooltip-margin;
        }
    }
</style>
