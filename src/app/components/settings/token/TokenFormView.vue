<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div>
        <v-card-title class="primary--text">
            {{ title }}
        </v-card-title>

        <v-data-table hide-default-footer :items="tokens" item-key="host" :headers="headers">
            <template v-slot:item.host="{value}">
                <strong>{{ value }}</strong>
            </template>

            <template v-slot:item.token="{value}">
                <span class="word-break-all">{{ value }}</span>
            </template>

            <template v-slot:item.action="{item}">
                <v-btn color="error"
                       outlined
                       ripple
                       rounded
                       small
                       @click="$emit('deleterequested', item)">
                    <v-icon small>delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <v-card-actions class="mt-3">
            <v-spacer></v-spacer>

            <v-btn text
                   ripple
                   rounded
                   :disabled="loading"
                   @click="$emit('close')">
                {{ $t('close') }}
            </v-btn>

            <v-btn color="accent"
                   depressed
                   ripple
                   rounded
                   @click="$emit('addrequested')">
                {{ $t('add') }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@app/mixins/AjaxFormContent';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class TokenFormView extends mixins(AjaxFormContent) {
        @Prop({type: String, required: true})
        public title: string;

        @Model()
        private value: object|any;

        public get headers() {
            return [
                {
                    text: this.$t('views.settings.host'),
                    value: 'host',
                    sortable: false,
                },
                {
                    text: this.$t('views.settings.token'),
                    value: 'token',
                    sortable: false,
                },
                {
                    value: 'action',
                    sortable: false,
                },
            ];
        }

        public get tokens(): object[] {
            const values: object[] = [];

            for (const host of Object.keys(this.value)) {
                values.push({
                    host,
                    token: this.value[host],
                });
            }

            return values;
        }
    }
</script>
