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
                        :label="$i18n.t('views.settings.host')"
                        v-model="host"
                        @keydown.enter="save"
                        outlined
                        clearable
                        autofocus
                        :disabled="loading"
                        :rules="[$r('required')]"
                        :color="$color('primary', 'primary lighten-3')"
                >
                </v-text-field>

                <v-switch
                        :label="$i18n.t('views.settings.token-auto-generation')"
                        :disabled="loading || tokenRequired"
                        v-model="autoGeneration"
                        class="mt-0"
                        :color="$color('primary', 'primary lighten-3')"
                ></v-switch>

                <v-slide-x-reverse-transition>
                    <v-text-field
                            v-if="!autoGeneration"
                            type="text"
                            :label="$i18n.t('views.settings.oauth-token')"
                            v-model="token"
                            :error-messages="fieldErrors('token')"
                            @keydown.enter="save"
                            outlined
                            clearable
                            :disabled="loading"
                            :rules="[$r('required')]"
                            :color="$color('primary', 'primary lighten-3')"
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
    import {TokenRequest} from '@app/api/models/requests/tokens/TokenRequest';
    import {TokenResponse} from '@app/api/models/responses/tokens/TokenResponse';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class TokenFormAdd extends mixins(AjaxFormContent) {
        @Prop({type: String, required: true})
        public title: string;

        @Prop({type: Function, required: true})
        public createToken: (data: TokenRequest, canceler: Canceler) => Promise<TokenResponse|null>;

        @Prop({type: String})
        public defaultHost?: string|null;

        @Prop({type: Boolean, default: false})
        public tokenRequired?: boolean;

        public host?: string|null = null;

        public token?: string|null = null;

        public autoGeneration: boolean = true;

        public created(): void {
            if (!this.host && this.defaultHost) {
                this.host = this.defaultHost;
            }

            this.autoGeneration = !this.tokenRequired;
        }

        public async save(): Promise<void> {
            if (!this.isValidForm()) {
                return;
            }

            const data = {
                host: this.host,
                token: this.token ? this.token : undefined,
            } as TokenRequest;
            const res = await this.fetchData<TokenResponse>((canceler: Canceler) => {
                return this.createToken(data, canceler);
            }, false);

            if (res) {
                this.loading = false;
                this.$emit('added', res);
            }
        }
    }
</script>
