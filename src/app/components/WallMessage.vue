<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="text-align-center">
        <slot name="icon"></slot>
        <h2 :class="$store.state.darkMode.enabled ? 'mb-5' : 'mb-5 text--secondary'" v-if="message || $slots.message">
            {{ message }}
            <slot name="message"></slot>
        </h2>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class WallMessage extends Vue {
        @Prop({type: String, required: false})
        public message!: string;
    }
</script>
