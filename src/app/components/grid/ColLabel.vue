<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-col cols="12" sm="6">
        <v-row>
            <v-col cols="12" md="4" :class="labelClasses" v-if="!hideLabel">
                <slot name="label">
                    {{ label }}
                </slot>
            </v-col>

            <v-col class="word-break-all">
                <slot name="default"></slot>
            </v-col>
        </v-row>
    </v-col>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class ColLabel extends Vue {
        @Prop({type: String})
        public label?: string;

        @Prop({type: Boolean, default: false})
        public hideLabel: boolean;

        @Prop({type: String, default: 'primary--text'})
        public labelColor: string;

        public get labelClasses(): object {
            const classes: any = {
                'font-weight-bold': true,
                'word-break-word': true,
                'text-right': true,
            };

            classes[this.labelColor] = true;

            return classes;
        }
    }
</script>
