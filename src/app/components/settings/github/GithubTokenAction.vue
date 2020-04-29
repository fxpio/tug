<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <token-action
        :title="$t('views.settings.webhook-token')"
        :fetch-tokens="fetchTokens"
        :create-token="createToken"
        :delete-token="deleteToken"
        :create-token-required="false"
        default-host="github.com"
    >
    </token-action>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TokenAction from '@app/components/settings/token/TokenAction.vue';
    import {Canceler} from '@app/api/Canceler';
    import {GithubToken} from '@app/api/services/GithubToken';
    import {TokensResponse} from '@app/api/models/responses/tokens/TokensResponse';
    import {TokenRequest} from '@app/api/models/requests/tokens/TokenRequest';
    import {TokenResponse} from '@app/api/models/responses/tokens/TokenResponse';
    import {TokenDeleteRequest} from '@app/api/models/requests/tokens/TokenDeleteRequest';
    import {TokenDeleteResponse} from '@app/api/models/responses/tokens/TokenDeleteResponse';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {TokenAction},
    })
    export default class GithubTokenAction extends Vue {
        public async fetchTokens(canceler: Canceler): Promise<TokensResponse|null> {
            return this.$api.get<GithubToken>(GithubToken).get(canceler);
        }

        public async createToken(data: TokenRequest, canceler: Canceler): Promise<TokenResponse> {
            return this.$api.get<GithubToken>(GithubToken).create(data, canceler);
        }

        public async deleteToken(data: TokenDeleteRequest, canceler: Canceler): Promise<TokenDeleteResponse> {
            return this.$api.get<GithubToken>(GithubToken).delete(data, canceler);
        }
    }
</script>
