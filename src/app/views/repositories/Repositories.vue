<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row>
            <v-col>
                <search-list :headers="headers" :fetch-request="fetchDataRequest">
                    <template v-slot:no-items.icon>
                        <v-row justify="center">
                            <lottie width="280px" :options="{animationData: iconData}"></lottie>
                        </v-row>
                    </template>

                    <template v-slot:no-items.message>
                        {{ $t('views.repositories.no-items') }}
                    </template>

                    <template v-slot:no-items>
                        <v-btn depressed rounded ripple color="accent" class="mt-5" :to="{name: 'repositories-add'}">
                            {{ $t('views.repositories.add-first') }}
                        </v-btn>
                    </template>

                    <template v-slot:header="{total}">
                        <v-subheader :class="$classes('mt-4 mb-4 primary--text', 'text--lighten-3')">
                            <lottie width="48px" :options="{animationData: iconData}"></lottie>
                            {{ $t('views.repositories.title') }}
                            <v-fade-transition mode="out-in">
                                <v-chip small outlined class="ml-2" v-if="null !== total">
                                    {{ total }}
                                </v-chip>
                            </v-fade-transition>
                        </v-subheader>
                    </template>

                    <template v-slot:header-actions>
                        <refresh-package-action
                                color="accent"
                                depressed
                                rounded
                                ripple
                                small
                        >
                            <template v-slot:btn-content="{small}">
                                <v-icon :small="small">settings_backup_restore</v-icon>
                            </template>
                        </refresh-package-action>
                    </template>

                    <template v-slot:data-table.item.service="{item}">
                        <repository-service :type="item.type"></repository-service>
                    </template>

                    <template v-slot:data-table.item.name="{item}">
                        <router-link
                                :class="$classes('font-weight-bold', 'primary--text text--lighten-3')"
                                :to="{name: 'repositories-package', params: {id: item.id}}">
                            {{ item.packageName ? item.packageName : item.url }}
                        </router-link>
                    </template>

                    <template v-slot:data-table.item.rootIdentifier="{item}">
                        <v-tooltip top v-if="!!item.rootIdentifier">
                            <template v-slot:activator="{ on }">
                                <v-chip small color="secondary" v-on="on">
                                    {{ item.rootIdentifier }}
                                </v-chip>
                            </template>
                            <span>{{ $t('views.repositories.root-identifier') }}</span>
                        </v-tooltip>

                        <div v-if="!item.packageName || !item.lastHash">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-chip x-small color="warning" v-on="on">
                                        {{ $t('views.repositories.last-hash.no-auto-updated') }}
                                    </v-chip>
                                </template>
                                <span>{{ $t('views.repositories.last-hash.no-auto-updated.hint') }}</span>
                            </v-tooltip>
                        </div>
                    </template>

                    <template v-slot:data-table.item.url="{item}">
                        <v-btn rounded
                               small
                               outlined
                               target="_blank"
                               :color="$color('primary', 'primary lighten-3')"
                               :href="item.url"
                        >
                            {{ $t('source') }}
                        </v-btn>
                    </template>

                    <template v-slot:data-table.item.actions="{item}">
                        <delete-action
                                :title="$t('views.repositories.title') + (item.packageName ? ' ' + item.packageName : '')"
                                :text="$t('views.repositories.remove-confirmation')"
                                v-model="item"
                                :delete-call="deleteItem"
                                rounded
                                small
                                @deleted="$root.$emit('search-list-delete-item', item.id, 'id')">
                        </delete-action>
                    </template>
                </search-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import SearchList from '@app/components/SearchList.vue';
    import Lottie from '@app/components/Lottie.vue';
    import iconData from '@app/assets/animations/repositoryIcon.json';
    import {ListResponse} from '@app/api/models/responses/ListResponse';
    import {CodeRepository} from '@app/api/models/responses/CodeRepository';
    import {FetchRequestDataEvent} from '@app/events/requests/FetchRequestDataEvent';
    import {Repositories as ApiRepositories} from '@app/api/services/Repositories';
    import DeleteAction from '@app/components/DeleteAction.vue';
    import {Canceler} from '@app/api/Canceler';
    import {RepositoryResponse} from '@app/api/models/responses/RepositoryResponse';
    import {RepositoryRequest} from '@app/api/models/requests/RepositoryRequest';
    import RepositoryService from '@app/components/repositories/RepositoryService.vue';
    import RefreshPackageAction from '@app/components/packages/RefreshPackageAction.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {RefreshPackageAction, RepositoryService, DeleteAction, SearchList, Lottie},
    })
    export default class Repositories extends Vue {
        public get iconData(): object {
            return  iconData;
        }

        public get headers(): object[] {
            return [
                {   align: 'center',
                    sortable: false,
                    value: 'service',
                    width: 60,
                },
                {   text: this.$i18n.t('views.repositories.package-name'),
                    align: 'left',
                    sortable: false,
                    value: 'name',
                },
                {   text: this.$i18n.t('views.repositories.root-identifier'),
                    align: 'left',
                    sortable: false,
                    value: 'rootIdentifier',
                },
                {   text: this.$i18n.t('views.repositories.url'),
                    align: 'left',
                    sortable: false,
                    value: 'url',
                },
                {   align: 'right',
                    sortable: false,
                    value: 'actions',
                },
            ];
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.repositories.title') as string,
            };
        }

        public async fetchDataRequest(event: FetchRequestDataEvent): Promise<ListResponse<CodeRepository>> {
            return await this.$api.get<ApiRepositories>(ApiRepositories)
                .list({lastId: event.lastId, search: event.search}, event.canceler) as ListResponse<CodeRepository>;
        }

        public async deleteItem(item: any, canceler: Canceler): Promise<RepositoryResponse> {
            const data = {
                url: item.url,
            } as RepositoryRequest;

            return this.$api.get<ApiRepositories>(ApiRepositories).disable(data, canceler);
        }
    }
</script>
