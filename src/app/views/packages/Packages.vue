<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row no-gutters justify="center">
            <v-col>
                <v-subheader class="mt-4 primary--text">
                    {{ $t('views.packages.title') }}
                </v-subheader>

                <v-fade-transition mode="out-in">
                    <loading v-if="firstLoading"></loading>

                    <wall-message :message="$t('views.packages.no-items')" v-else-if="!count">
                        <template v-slot:icon>
                            <v-row justify="center">
                                <lottie width="280px" :options="{animationData: iconData}"></lottie>
                            </v-row>
                        </template>

                        <v-btn color="accent" ripple class="mt-3" :to="{name: 'packages-add'}">{{ $t('views.packages.add-first') }}</v-btn>
                    </wall-message>

                    <v-card flat v-else>
                        <v-data-table
                                :headers="headers"
                                :items="items"
                                :loading="loading"
                                hide-default-footer
                                item-key="id">
                            <template slot="items" slot-scope="props">
                                <td>
                                    <span class="font-weight-bold">{{ props.item.packageName ? props.item.packageName : props.item.url }}</span>
                                    <br>
                                    <span class="font-italic">{{ props.item.type }}</span>
                                </td>
                                <td>
                                    <a :href="props.item.url" target="_blank">{{ $t('source') }}</a>
                                </td>
                            </template>
                            <template slot="footer" v-if="lastId !== null">
                                <td colspan="100%" class="pl-0 pr-0 text-xs-center">
                                    <v-btn color="accent" depressed ripple @click="fetchData()">
                                        {{ $t('pagination.load-more') }}
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-fade-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxListContent} from '@app/mixins/AjaxListContent';
    import {ListResponse} from '@app/api/models/responses/ListResponse';
    import {CodeRepository} from '@app/api/models/responses/CodeRepository';
    import {Packages as ApiPackages} from '@app/api/services/Packages';
    import WallMessage from '@app/components/WallMessage.vue';
    import Loading from '@app/components/Loading.vue';
    import Lottie from '@app/components/Lottie.vue';
    import iconData from '@app/assets/animations/packageIcon.json';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {Lottie, Loading, WallMessage},
    })
    export default class Packages extends mixins(AjaxListContent) {
        public get iconData(): object {
            return  iconData;
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.packages.title') as string,
            };
        }

        public async created(): Promise<void> {
            this.headers = [
                {   text: this.$i18n.t('views.packages.package-name'),
                    align: 'left',
                    sortable: false,
                    value: 'name',
                },
                {   text: this.$i18n.t('views.packages.url'),
                    align: 'left',
                    sortable: false,
                    value: 'url',
                },
            ];

            this.$root.$on('toolbar-search-out', async (searchValue: string) => {
                this.search = searchValue;
            });

            await this.fetchData();
        }

        public destroyed() {
            this.$root.$off('toolbar-search-out');
        }

        @Watch('search')
        public async searchRequest(searchValue?: string): Promise<void> {
            this.$root.$emit('toolbar-search-in', searchValue);
            await this.fetchData(searchValue);
        }

        public async fetchDataRequest(searchValue?: string): Promise<ListResponse<CodeRepository>> {
            const res = await this.$api.get<ApiPackages>(ApiPackages)
                .list({lastId: this.lastId, search: this.search ? this.search : null}, this.previousRequest);

            this.loading = false;

            return res;
        }
    }
</script>
