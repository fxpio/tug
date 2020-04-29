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
            {{ $t('delete.confirmation.text') }}
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

            <v-btn color="error"
                   depressed
                   ripple
                   rounded
                   :loading="loading"
                   :disabled="loading"
                   @click="deleteToken">
                {{ $t('delete') }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import {Canceler} from '@app/api/Canceler';
    import {GithubOauthToken} from '@app/api/services/GithubOauthToken';
    import {GithubOauthTokenDeleteRequest} from '@app/api/models/requests/github/GithubOauthTokenDeleteRequest';
    import {GithubOauthTokenDeleteResponse} from '@app/api/models/responses/github/GithubOauthTokenDeleteResponse';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class GithubOauthTokenFormDelete extends mixins(AjaxContent) {
        @Prop({type: String, required: true})
        public host: string;

        public async deleteToken(): Promise<void> {
            const data = {
                host: this.host,
            } as GithubOauthTokenDeleteRequest;
            const res = await this.fetchData<GithubOauthTokenDeleteResponse>((canceler: Canceler) => {
                return this.$api.get<GithubOauthToken>(GithubOauthToken).delete(data, canceler);
            }, true);

            if (res) {
                this.loading = false;
                this.$emit('deleted', res);
            }
        }
    }
</script>
