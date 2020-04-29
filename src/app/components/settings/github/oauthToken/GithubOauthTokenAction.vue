<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
            v-model="dialog"
            :close-on-content-click="false"
            persistent
            max-width="600"
    >
        <template v-slot:activator="{ on }">
            <v-scale-transition mode="out-in" :origin="origin">
                <v-progress-circular key="loading" v-if="['init', 'loading'].includes(actionType)"
                                     indeterminate width="2" size="16" :color="color">
                </v-progress-circular>

                <v-btn key="retryBtn" v-else-if="'error' === actionType"
                       depressed rounded small color="warning"
                       v-on="on">
                    {{ $t('retry') }}
                </v-btn>

                <v-btn key="showBtn" v-else-if="'show' === actionType"
                       depressed rounded small color="success"
                       v-on="on">
                    {{ $t('show') }}
                </v-btn>

                <v-btn key="addBtn" v-else-if="'add' === actionType"
                       depressed rounded small :color="color"
                       v-on="on">
                    {{ $t('add') }}
                </v-btn>
            </v-scale-transition>
        </template>

        <v-card>
            <v-slide-x-transition mode="out-in">
                <github-oauth-token-form-add
                        @cancel="dialog = false"
                        @added="tokenAdded"
                        v-if="'add' === dialogActionType">
                </github-oauth-token-form-add>

                <github-oauth-token-form-delete
                        :host="hostToDelete"
                        @cancel="manualDialogActionType = 'show'"
                        @deleted="tokenDeleted"
                        v-else-if="'delete' === dialogActionType">
                </github-oauth-token-form-delete>

                <github-oauth-token-form-view
                        @close="dialog = false"
                        @addrequested="addRequested"
                        @deleterequested="deleteRequested"
                        v-model="tokens"
                        v-else-if="'show' === dialogActionType">
                </github-oauth-token-form-view>
            </v-slide-x-transition>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import {Canceler} from '@app/api/Canceler';
    import {GithubOauthTokensResponse} from '@app/api/models/responses/github/GithubOauthTokensResponse';
    import {GithubOauthToken} from '@app/api/services/GithubOauthToken';
    import {MapObject} from '@app/api/models/MapObject';
    import GithubOauthTokenFormAdd from '@app/components/settings/github/oauthToken/GithubOauthTokenFormAdd.vue';
    import {GithubOauthTokenResponse} from '@app/api/models/responses/github/GithubOauthTokenResponse';
    import GithubOauthTokenFormView from '@app/components/settings/github/oauthToken/GithubOauthTokenFormView.vue';
    import GithubOauthTokenFormDelete from '@app/components/settings/github/oauthToken/GithubOauthTokenFormDelete.vue';
    import {GithubOauthTokenDeleteResponse} from '@app/api/models/responses/github/GithubOauthTokenDeleteResponse';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {GithubOauthTokenFormDelete, GithubOauthTokenFormView, GithubOauthTokenFormAdd},
    })
    export default class GithubOauthTokenAction extends mixins(AjaxContent) {
        @Prop({type: String, default: 'accent'})
        public color: string;

        @Prop({type: String, default: 'center center'})
        public origin: string;

        public init: boolean = false;

        public dialog: boolean = false;

        public tokens: MapObject<string> = {};

        private manualDialogActionType: string|null = null;

        private hostToDelete: string|null = null;

        public get dialogActionType(): string {
            if (!this.dialog) {
                return 'hidden';
            }

            return this.manualDialogActionType
                ? this.manualDialogActionType
                : this.actionType;
        }

        public get actionType(): string {
            // Force to react when dialog is updated
            let res = this.dialog ? 'add' : 'add';

            if (!this.init && !this.previousError) {
                res = 'init';
            } else if (this.loading) {
                res = 'loading';
            } else if (Object.keys(this.tokens as object).length > 0) {
                res = 'show';
            } else if (this.previousError) {
                res = 'error';
            }

            return res;
        }

        @Watch('dialog')
        public watchDialog(value: boolean): void {
            if (!value) {
                this.manualDialogActionType = null;
            }
        }

        public async created(): Promise<void> {
            const res = await this.fetchData<GithubOauthTokensResponse>((canceler: Canceler) => {
                return this.$api.get<GithubOauthToken>(GithubOauthToken).get(canceler);
            }, true);

            this.tokens = res?.tokens as MapObject ?? {};
            this.loading = false;
            this.init = true;
        }

        public tokenAdded(result: GithubOauthTokenResponse): void {
            this.tokens[result.host] = result.token;
            this.manualDialogActionType = 'show';
        }

        public addRequested(): void {
            this.manualDialogActionType = 'add';
        }

        public tokenDeleted(result: GithubOauthTokenDeleteResponse): void {
            delete this.tokens[result.host];
            this.hostToDelete = null;

            if (Object.keys(this.tokens).length > 0) {
                this.manualDialogActionType = 'show';
            } else {
                this.dialog = false;
            }
        }

        public deleteRequested(item: any): void {
            this.manualDialogActionType = 'delete';
            this.hostToDelete = item.host as string;
        }
    }
</script>
