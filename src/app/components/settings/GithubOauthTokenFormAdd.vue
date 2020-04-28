<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div>
        <v-card-title class="primary--text">
            {{ $t('views.settings.oauth-token') }}
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
                        :readonly="loading"
                        :rules="[$r('required')]"
                >
                </v-text-field>

                <v-switch
                        :label="$i18n.t('views.settings.token-auto-generation')"
                        v-model="autoGeneration"
                        class="mt-0"
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
                            :readonly="loading"
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
    import {Component} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@app/mixins/AjaxFormContent';
    import {GithubOauthTokenResponse} from '@app/api/models/responses/github/GithubOauthTokenResponse';
    import {Canceler} from '@app/api/Canceler';
    import {GithubOauthToken} from '@app/api/services/GithubOauthToken';
    import {GithubOauthTokenRequest} from '@app/api/models/requests/github/GithubOauthTokenRequest';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class GithubOauthTokenFormAdd extends mixins(AjaxFormContent) {
        public host?: string|null = 'github.com';

        public token?: string|null = null;

        public autoGeneration: boolean = true;

        public async save(): Promise<void> {
            if (!this.isValidForm()) {
                return;
            }

            const data = {
                host: this.host,
                token: this.token ? this.token : undefined,
            } as GithubOauthTokenRequest;
            const res = await this.fetchData<GithubOauthTokenResponse>((canceler: Canceler) => {
                return this.$api.get<GithubOauthToken>(GithubOauthToken).create(data, canceler);
            }, false);

            if (res) {
                this.loading = false;
                this.$emit('added', res);
            }
        }
    }
</script>
