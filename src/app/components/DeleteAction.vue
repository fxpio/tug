<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog v-model="dialog" persistent max-width="400" class="v-btn">
        <template v-slot:activator="{on}">
            <slot name="default" :on="on">
                <v-btn v-on="on"
                       color="error"
                       :class="classes"
                       outlined
                       ripple
                       rounded
                       small
                >
                    <v-icon small>delete</v-icon>
                </v-btn>
            </slot>
        </template>
        <v-card>
            <v-card-title class="primary--text">
                {{ title }}
            </v-card-title>

            <v-card-text class="pt-4">
                {{ $t('delete.confirmation.text') }}
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
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
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
        public classes?: string;

        @Prop({type: Function, required: true})
        public deleteCall: (data: any, canceler: Canceler) => Promise<any|null>;

        private dialog: boolean = false;

        public async deleteAction(): Promise<void> {
            const res = await this.fetchData<any>((canceler: Canceler) => {
                return this.deleteCall(this.$attrs.value, canceler);
            }, true);

            if (res) {
                this.loading = false;
                this.dialog = false;
                this.$emit('deleted', res);
            }
        }
    }
</script>
