<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="text-align-center">
        <slot name="icon"></slot>
        <h2 :class="$store.state.darkMode.enabled ? null : 'grey--text'" v-if="message">
            {{ message }}
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
        @Prop({type: String, required: true})
        public message!: string;
    }
</script>
