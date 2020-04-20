<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-row align="center" justify="center">
        <v-col class="text-align-center">
            <v-icon :size="iconSize" :color="iconColor">{{ icon }}</v-icon>
            <h2 :class="$store.state.darkMode.enabled ? null : 'grey--text'">{{ message }}</h2>
            <slot></slot>
        </v-col>
    </v-row>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class ErrorMessage extends Vue {
        @Prop({type: String, required: true})
        public message!: string;

        @Prop({type: String, default: 'error'})
        public icon!: string;

        @Prop({type: String, default: '14em'})
        public iconSize!: string;

        @Prop({type: String, default: 'red'})
        public iconColor!: string;
    }
</script>
