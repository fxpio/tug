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
                    {{ $t('views.repositories.title') }}
                </v-subheader>

                <v-card flat>
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
    import {Repositories as ApiRepositories} from '@app/api/services/Repositories';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class Repositories extends mixins(AjaxListContent) {
        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.repositories.title') as string,
            };
        }

        public async created(): Promise<void> {
            this.headers = [
                {   text: this.$i18n.t('views.repositories.package-name'),
                    align: 'left',
                    sortable: false,
                    value: 'name',
                },
                {   text: this.$i18n.t('views.repositories.url'),
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
            const res = await this.$api.get<ApiRepositories>(ApiRepositories)
                .list({lastId: this.lastId, search: this.search ? this.search : null}, this.previousRequest);

            this.loading = false;

            return res;
        }
    }
</script>
