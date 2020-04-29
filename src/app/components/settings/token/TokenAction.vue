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
                <token-form-add
                        :title="title"
                        :default-host="defaultHost"
                        :create-token="createToken"
                        @cancel="dialog = false"
                        @added="tokenAdded"
                        v-if="'add' === dialogActionType">
                </token-form-add>

                <token-form-delete
                        :title="title"
                        :delete-token="deleteToken"
                        :host="hostToDelete"
                        @cancel="manualDialogActionType = 'show'"
                        @deleted="tokenDeleted"
                        v-else-if="'delete' === dialogActionType">
                </token-form-delete>

                <token-form-view
                        :title="title"
                        @close="dialog = false"
                        @addrequested="addRequested"
                        @deleterequested="deleteRequested"
                        v-model="tokens"
                        v-else-if="'show' === dialogActionType">
                </token-form-view>
            </v-slide-x-transition>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import {Canceler} from '@app/api/Canceler';
    import {MapObject} from '@app/api/models/MapObject';
    import {TokensResponse} from '@app/api/models/responses/tokens/TokensResponse';
    import {TokenRequest} from '@app/api/models/requests/tokens/TokenRequest';
    import {TokenResponse} from '@app/api/models/responses/tokens/TokenResponse';
    import {TokenDeleteRequest} from '@app/api/models/requests/tokens/TokenDeleteRequest';
    import {TokenDeleteResponse} from '@app/api/models/responses/tokens/TokenDeleteResponse';
    import TokenFormAdd from './TokenFormAdd.vue';
    import TokenFormView from './TokenFormView.vue';
    import TokenFormDelete from './TokenFormDelete.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {TokenFormDelete, TokenFormView, TokenFormAdd},
    })
    export default class TokenAction extends mixins(AjaxContent) {
        @Prop({type: String, required: true})
        public title: string;

        @Prop({type: Function, required: true})
        public fetchTokens: (canceler: Canceler) => Promise<TokensResponse|null>;

        @Prop({type: Function, required: true})
        public createToken: (data: TokenRequest, canceler: Canceler) => Promise<TokenResponse|null>;

        @Prop({type: Function, required: true})
        public deleteToken: (data: TokenDeleteRequest, canceler: Canceler) => Promise<TokenDeleteResponse|null>;

        @Prop({type: String, required: true})
        public defaultHost: string;

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
            const res = await this.fetchData<TokensResponse>((canceler: Canceler) => {
                return this.fetchTokens(canceler);
            }, true);

            this.tokens = res?.tokens as MapObject ?? {};
            this.loading = false;
            this.init = true;
        }

        public tokenAdded(result: TokenResponse): void {
            this.tokens[result.host] = result.token;
            this.manualDialogActionType = 'show';
        }

        public addRequested(): void {
            this.manualDialogActionType = 'add';
        }

        public tokenDeleted(result: TokenDeleteResponse): void {
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
