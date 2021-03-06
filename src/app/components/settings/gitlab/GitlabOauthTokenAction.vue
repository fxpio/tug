<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <token-action
        :title="$t('views.settings.gitlab.oauth-token')"
        :create-token-field-label="$i18n.t('views.settings.gitlab.oauth-token')"
        :fetch-tokens="fetchTokens"
        :create-token="createToken"
        :delete-token="deleteToken"
        :create-token-required="true"
        default-host="gitlab.com"
    >
    </token-action>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TokenAction from '@app/components/settings/token/TokenAction.vue';
    import {Canceler} from '@app/api/Canceler';
    import {GitlabOauthToken} from '@app/api/services/GitlabOauthToken';
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
    export default class GitlabOauthTokenAction extends Vue {
        public async fetchTokens(canceler: Canceler): Promise<TokensResponse|null> {
            return this.$api.get<GitlabOauthToken>(GitlabOauthToken).get(canceler);
        }

        public async createToken(data: TokenRequest, canceler: Canceler): Promise<TokenResponse> {
            return this.$api.get<GitlabOauthToken>(GitlabOauthToken).create(data, canceler);
        }

        public async deleteToken(data: TokenDeleteRequest, canceler: Canceler): Promise<TokenDeleteResponse> {
            return this.$api.get<GitlabOauthToken>(GitlabOauthToken).delete(data, canceler);
        }
    }
</script>
