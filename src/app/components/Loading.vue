<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog v-model="value" eager persistent fullscreen hide-overlay transition="fade-transition" v-if="fullscreen">
        <v-card class="fill-height">
            <v-container fluid fill-height>
                <v-row no-gutters align="center" justify="center">
                    <v-progress-circular indeterminate :size="46" :color="progressColor"></v-progress-circular>
                    <h1 v-if="message != null">{{message}}</h1>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>

    <v-container fill-height v-else>
        <v-row no-gutters align="center" justify="center" >
            <v-progress-circular indeterminate :size="46" :color="progressColor"></v-progress-circular>
            <h1 v-if="message != null">{{message}}</h1>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class Loading extends Vue {
        @Prop({type: Boolean, default: false})
        public value!: boolean;

        @Prop({type: String, default: null})
        public message!: string|null;

        @Prop({type: String, default: 'accent'})
        public progressColor!: string;

        @Prop({type: Boolean, default: false})
        public fullscreen!: boolean;
    }
</script>
