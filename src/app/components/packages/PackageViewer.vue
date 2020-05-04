<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog v-model="dialog" persistent :max-width="maxWidth" class="v-btn">
        <template v-slot:activator="{on}">
            <slot name="default"
                  :on="on"
                  :btnLoading="loading"
                  :btnColor="color"
                  :btnClasses="classes"
                  :btnRipple="ripple"
                  :btnRounded="rounded"
                  :btnDepressed="depressed"
                  :btnOutlined="outlined"
                  :btnsmall="small"
            >
                <v-btn v-on="on"
                       :color="color"
                       :class="classes"
                       :ripple="ripple"
                       :rounded="rounded"
                       :depressed="depressed"
                       :outlined="outlined"
                       :small="small"
                >
                    <slot name="btn-icon">
                        <v-icon :small="small">visibility</v-icon>
                    </slot>
                </v-btn>
            </slot>
        </template>

        <v-card>
            <v-toolbar flat class="transparent">
                <v-toolbar-title class="no-max-width">
                    <span :class="$classes('font-weight-bold primary--text', 'text--lighten-3')">
                        {{ package.name }}
                    </span>
                    <span> - </span>
                    <span class="font-italic">{{ package.version }}</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn
                        depressed
                        fab
                        small
                        @click="dialog = !dialog"
                >
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <div class="pa-4 json-viewer-wrapper">
                <json-view
                        :rootKey="package.version"
                        :data="package"
                        :maxDepth="maxDepth"
                        :colorScheme="colorScheme"
                ></json-view>
            </div>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Model, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import {Package} from '@app/api/models/responses/Package';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class PackageViewer extends mixins(AjaxContent) {
        @Prop({type: String})
        public maxWidth?: string;

        @Prop({type: String, default: 'accent'})
        public color: string;

        @Prop({type: String})
        public classes?: string;

        @Prop({type: Boolean, default: false})
        public ripple: boolean;

        @Prop({type: Boolean, default: false})
        public rounded: boolean;

        @Prop({type: Boolean, default: false})
        public depressed: boolean;

        @Prop({type: Boolean, default: false})
        public outlined: boolean;

        @Prop({type: Boolean, default: false})
        public small: boolean;

        @Prop({type: Number, default: 10})
        public maxDepth: number;

        @Model()
        private package: Package;

        private dialog: boolean = false;

        public get colorScheme(): string|undefined {
            return this.$vuetify.theme.dark ? 'dark' : undefined;
        }
    }
</script>

<style lang="scss" scoped="scoped">
    .json-viewer-wrapper {
        max-height: 80vh;
        overflow: auto;
    }
</style>
