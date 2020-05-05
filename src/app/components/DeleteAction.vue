<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-scroller-dialog
            v-model="dialog"
            persistent
            :max-width="maxWidth"
            class="v-btn"
    >
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
                        <v-icon :small="small">delete</v-icon>
                    </slot>
                </v-btn>
            </slot>
        </template>
        <v-card>
            <v-card-title :class="$classes('primary--text', 'text--lighten-3')">
                <slot name="title">
                    {{ title }}
                </slot>
            </v-card-title>

            <v-card-text class="pt-4">
                <slot name="text">
                    {{ text ? text : $t('delete.confirmation.text') }}
                </slot>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text
                       ripple
                       rounded
                       :disabled="loading"
                       @click="dialog = false">
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn color="error"
                       depressed
                       ripple
                       rounded
                       :loading="loading"
                       :disabled="loading"
                       @click="deleteAction">
                    {{ $t('delete') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-scroller-dialog>
</template>

<script lang="ts">
    import {Component, Model, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import {Canceler} from '@app/api/Canceler';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class DeleteAction extends mixins(AjaxContent) {
        @Prop({type: String, required: true})
        public title: string;

        @Prop({type: String})
        public text?: string;

        @Prop({type: String, default: '400'})
        public maxWidth: string;

        @Prop({type: String, default: 'red darken-3'})
        public color: string;

        @Prop({type: String})
        public classes?: string;

        @Prop({type: Boolean, default: false})
        public ripple: boolean;

        @Prop({type: Boolean, default: false})
        public rounded: boolean;

        @Prop({type: Boolean, default: false})
        public depressed: boolean;

        @Prop({type: Boolean, default: true})
        public outlined: boolean;

        @Prop({type: Boolean, default: false})
        public small: boolean;

        @Prop({type: Function, required: true})
        public deleteCall: (data: any, canceler: Canceler) => Promise<any|null>;

        @Model()
        @Prop()
        private data: any;

        private dialog: boolean = false;

        public async deleteAction(): Promise<void> {
            const res = await this.fetchData<any>((canceler: Canceler) => {
                return this.deleteCall(this.data, canceler);
            }, true);

            if (res) {
                this.loading = false;
                this.dialog = false;
                this.$emit('deleted', res);
            }
        }
    }
</script>
