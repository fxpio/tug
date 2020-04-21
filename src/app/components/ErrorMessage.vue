<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <wall-message :message="message">
        <template v-slot:icon>
            <v-icon :size="iconSize" :color="iconColor">{{ icon }}</v-icon>
        </template>

        <template v-slot:default>
            <slot></slot>
        </template>
    </wall-message>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import WallMessage from '@app/components/WallMessage.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {WallMessage},
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
