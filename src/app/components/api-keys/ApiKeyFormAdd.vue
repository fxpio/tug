<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div>
        <v-card-title :class="$classes('primary--text', 'text--lighten-3')">
            {{ title }}
        </v-card-title>

        <v-card-text class="pt-4 pb-0">
            <v-alert type="error" class="mb-4" transition="scale-transition" mode="out-in" :value="showFormAlert">
                {{ formAlert }}
            </v-alert>

            <v-form ref="form" @submit.prevent>
                <v-text-field
                        type="text"
                        :label="$i18n.t('views.api-keys.fingerprint')"
                        v-model="fingerprint"
                        :error-messages="fieldErrors('fingerprint')"
                        @keydown.enter="save"
                        outlined
                        clearable
                        autofocus
                        :disabled="loading"
                        :hint="$t('views.api-keys.fingerprint.hint')"
                >
                </v-text-field>

                <v-switch
                        :label="$i18n.t('views.api-keys-add.token-auto-generation')"
                        :disabled="loading"
                        v-model="autoGeneration"
                        class="mt-0"
                        :color="$color('primary', 'primary lighten-3')"
                ></v-switch>

                <v-slide-x-reverse-transition>
                    <v-text-field
                            v-if="!autoGeneration"
                            type="text"
                            :label="$i18n.t('views.api-keys.token')"
                            v-model="token"
                            :error-messages="fieldErrors('token')"
                            @keydown.enter="save"
                            outlined
                            clearable
                            :disabled="loading"
                            :rules="[$r('required')]"
                    >
                    </v-text-field>
                </v-slide-x-reverse-transition>
            </v-form>
        </v-card-text>

        <v-card-actions class="mt-3">
            <v-spacer></v-spacer>

            <v-btn text
                   ripple
                   rounded
                   :disabled="loading"
                   @click="$emit('cancel')">
                {{ $t('cancel') }}
            </v-btn>

            <v-btn color="accent"
                   depressed
                   ripple
                   rounded
                   :loading="loading"
                   :disabled="loading"
                   @click="save">
                {{ $t('save') }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@app/mixins/AjaxFormContent';
    import {Canceler} from '@app/api/Canceler';
    import {ApiKeyRequest} from '@app/api/models/requests/ApiKeyRequest';
    import {ApiKeyResponse} from '@app/api/models/responses/ApiKeyResponse';
    import {ApiKeys} from '@app/api/services/ApiKeys';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class ApiKeyFormAdd extends mixins(AjaxFormContent) {
        @Prop({type: String, required: true})
        public title: string;

        public fingerprint?: string|null = null;

        public token?: string|null = null;

        public autoGeneration: boolean = true;

        public async save(): Promise<void> {
            if (this.isValidForm()) {
                const data = {
                    fingerprint: this.fingerprint ? this.fingerprint : undefined,
                    token: this.token ? this.token : undefined,
                } as ApiKeyRequest;
                const res = await this.fetchData<ApiKeyResponse>((canceler: Canceler) => {
                    return this.$api.get<ApiKeys>(ApiKeys).create(data, canceler);
                }, false);

                if (res) {
                    this.loading = false;
                    this.$emit('added', res);
                }
            }
        }
    }
</script>
