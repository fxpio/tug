<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <!-- Single mode -->
    <v-tooltip top class="v-btn" :disabled="disableTooltip" v-if="singleAction">
        <template v-slot:activator="{on}">
            <slot name="default"
                  :on="on"
                  :url="url"
                  :version="version"
                  :btnLoading="loading"
                  :btnColor="color"
                  :btnClasses="classes"
                  :btnRipple="ripple"
                  :btnRounded="rounded"
                  :btnDepressed="depressed"
                  :btnOutlined="outlined"
                  :btnsmall="small"
                  :tooltipMessage="tooltipMessage"
                  :disableTooltip="disableTooltip"
                  :cache="cache"
                  :force="force"
                  :singleAction="singleAction"
                  :refresh="refresh"
                  :refreshAll="refreshAll"
                  :refreshOne="refreshOne"
                  :refreshOneVersion="refreshOneVersion"
                  :refreshCacheAll="refreshCacheAll"
                  :refreshCacheOne="refreshCacheOne"
            >
                <v-btn v-on="on"
                       :color="color"
                       :loading="loading"
                       :class="classes"
                       :ripple="ripple"
                       :rounded="rounded"
                       :depressed="depressed"
                       :outlined="outlined"
                       :small="small"
                       @click="refresh()"
                >
                    <slot name="btn-content">
                        <v-icon small>refresh</v-icon>
                    </slot>
                </v-btn>
            </slot>
        </template>
        <span>{{ tooltipMessage }}</span>
    </v-tooltip>

    <!-- Multiple mode -->
    <v-menu class="v-btn" v-else>
        <template v-slot:activator="{on}">
            <slot name="default"
                  :on="on"
                  :url="url"
                  :version="version"
                  :btnLoading="loading"
                  :btnColor="color"
                  :btnClasses="classes"
                  :btnRipple="ripple"
                  :btnRounded="rounded"
                  :btnDepressed="depressed"
                  :btnOutlined="outlined"
                  :btnsmall="small"
                  :tooltipMessage="tooltipMessage"
                  :disableTooltip="disableTooltip"
                  :cache="cache"
                  :force="force"
                  :singleAction="singleAction"
                  :refresh="refresh"
                  :refreshAll="refreshAll"
                  :refreshOne="refreshOne"
                  :refreshOneVersion="refreshOneVersion"
                  :refreshCacheAll="refreshCacheAll"
                  :refreshCacheOne="refreshCacheOne"
            >
                <v-btn v-on="on"
                       :color="color"
                       :loading="loading"
                       :class="classes"
                       :ripple="ripple"
                       :rounded="rounded"
                       :depressed="depressed"
                       :outlined="outlined"
                       :small="small"
                       @click="refresh()"
                >
                    <slot name="btn-content" :small="small">
                        <v-icon :small="small">refresh</v-icon>
                    </slot>
                    &nbsp;
                    <v-icon>arrow_drop_down</v-icon>
                </v-btn>
            </slot>
        </template>

        <slot name="multiple-menu"
              :url="url"
              :version="version"
              :btnLoading="loading"
              :btnColor="color"
              :btnClasses="classes"
              :btnRipple="ripple"
              :btnRounded="rounded"
              :btnDepressed="depressed"
              :btnOutlined="outlined"
              :btnsmall="small"
              :tooltipMessage="tooltipMessage"
              :disableTooltip="disableTooltip"
              :cache="cache"
              :force="force"
              :singleAction="singleAction"
              :refresh="refresh"
              :refreshAll="refreshAll"
              :refreshOne="refreshOne"
              :refreshOneVersion="refreshOneVersion"
              :refreshCacheAll="refreshCacheAll"
              :refreshCacheOne="refreshCacheOne"
        >
            <!-- Default list items of multiple mode -->
            <v-list :color="color" dark>
                <v-list-item v-if="url && version"
                             @click="refreshOneVersion(url, version, false)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.one.version') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="url && version"
                             @click="refreshOneVersion(url, version, true)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.one.version.force') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="url && !version"
                             @click="refreshOne(url, false)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.one') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="url && !version"
                             @click="refreshOne(url, true)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.one.force') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="url && !version"
                             @click="refreshCacheOne(url)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.cache.one') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="!url && !version"
                             @click="refreshAll(false)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.all') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="!url && !version"
                             @click="refreshAll(true)">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.all.force') }}
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="!url && !version"
                             @click="refreshCacheAll()">
                    <v-list-item-content>
                        {{ $t('component.refresh-package.cache.all') }}
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </slot>
    </v-menu>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import {Canceler} from '@app/api/Canceler';
    import {Packages} from '@app/api/services/Packages';
    import {MessageResponse} from '@app/api/models/responses/MessageResponse';
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class RefreshPackageAction extends mixins(AjaxContent) {
        @Prop({type: String})
        public url?: string;

        @Prop({type: String})
        public version?: string;

        @Prop({type: Boolean, default: false})
        public singleAction: boolean;

        @Prop({type: Boolean, default: false})
        public force: boolean;

        @Prop({type: Boolean, default: false})
        public cache: boolean;

        @Prop({type: Boolean, default: false})
        public disableTooltip: boolean;

        @Prop({type: String, default: 'primary'})
        public color: string;

        @Prop({type: String})
        public classes?: string;

        @Prop({type: Boolean, default: false})
        public ripple: boolean;

        @Prop({type: Boolean, default: false})
        public rounded: boolean;

        @Prop({type: Boolean, default: false})
        public depressed: boolean;

        @Prop({type: Boolean, default: false})
        public outlined: boolean;

        @Prop({type: Boolean, default: false})
        public small: boolean;

        public get tooltipMessage(): string {
            if (this.cache) {
                if (this.url) {
                    return this.$i18n.t('component.refresh-package.cache.one') as string;
                } else {
                    return this.$i18n.t('component.refresh-package.cache.all') as string;
                }
            } else {
                if (this.url) {
                    if (this.version) {
                        if (this.force) {
                            return this.$i18n.t('component.refresh-package.one.version.force') as string;
                        } else {
                            return this.$i18n.t('component.refresh-package.one.version') as string;
                        }
                    } else {
                        if (this.force) {
                            return this.$i18n.t('component.refresh-package.one.force') as string;
                        } else {
                            return this.$i18n.t('component.refresh-package.one') as string;
                        }
                    }
                } else {
                    if (this.force) {
                        return this.$i18n.t('component.refresh-package.all.force') as string;
                    } else {
                        return this.$i18n.t('component.refresh-package.all') as string;
                    }
                }
            }
        }

        public async refresh(): Promise<void> {
            if (!this.singleAction) {
                return;
            }

            if (this.cache) {
                if (this.url) {
                    await this.refreshCacheOne(this.url);
                } else {
                    await this.refreshCacheAll();
                }
            } else {
                if (this.url) {
                    if (this.version) {
                        await this.refreshOneVersion(this.url, this.version, this.force);
                    } else {
                        await this.refreshOne(this.url, this.force);
                    }
                } else {
                    await this.refreshAll(this.force);
                }
            }
        }

        public async refreshAll(force: boolean = false): Promise<void> {

            const res = await this.fetchData((canceler: Canceler) => {
                return this.$api.get<Packages>(Packages).refreshAll(force, canceler);
            }, true);

            this.postSuccess('refreshedall', res);
        }

        public async refreshOne(url: string, force: boolean = false): Promise<void> {

            const res = await this.fetchData((canceler: Canceler) => {
                return this.$api.get<Packages>(Packages).refreshOne(url, force, canceler);
            }, true);

            this.postSuccess('refreshedone', res);
        }

        public async refreshOneVersion(url: string, version: string, force: boolean = false): Promise<void> {

            const res = await this.fetchData((canceler: Canceler) => {
                return this.$api.get<Packages>(Packages).refreshOneVersion(url, version, force, canceler);
            }, true);

            this.postSuccess('refreshedoneversion', res);
        }

        public async refreshCacheAll(): Promise<void> {

            const res = await this.fetchData((canceler: Canceler) => {
                return this.$api.get<Packages>(Packages).refreshCacheAll(canceler);
            }, true);

            this.postSuccess('refreshedcacheall', res);
        }

        public async refreshCacheOne(url: string): Promise<void> {

            const res = await this.fetchData((canceler: Canceler) => {
                return this.$api.get<Packages>(Packages).refreshCacheOne(url, canceler);
            }, true);

            this.postSuccess('refreshedcacheone', res);
        }

        private postSuccess(eventName: string, res: MessageResponse|null): void {
            if (res) {
                this.loading = false;
                this.$snackbar.snack(new SnackbarMessage(res.message, 'success'));
                this.$emit(eventName, res);
            }
        }
    }
</script>
