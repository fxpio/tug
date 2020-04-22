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

                <search-list :headers="headers" :fetch-request="fetchDataRequest">
                    <template #no-items-icon>
                        <v-row justify="center">
                            <lottie width="280px" :options="{animationData: iconData}"></lottie>
                        </v-row>
                    </template>

                    <template v-slot:data-table.item.name="{item}">
                        <span class="font-weight-bold">{{ item.packageName ? item.packageName : item.url }}</span>
                        <br>
                        <span class="font-italic">{{ item.type }}</span>
                    </template>

                    <template v-slot:data-table.item.url="{item}">
                        <a :href="item.url" target="_blank">{{ $t('source') }}</a>
                    </template>

                    <template v-slot:no-items>
                        <v-btn color="accent" ripple class="mt-3" :to="{name: 'repositories-add'}">{{ $t('views.repositories.add-first') }}</v-btn>
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

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {SearchList, Lottie},
    })
    export default class Repositories extends Vue {
        public get iconData(): object {
            return  iconData;
        }

        public get headers(): object[] {
            return [
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
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.repositories.title') as string,
            };
        }

        public async fetchDataRequest(event: FetchRequestDataEvent<ListResponse<CodeRepository>>): Promise<ListResponse<CodeRepository>> {
            return await this.$api.get<ApiRepositories>(ApiRepositories)
                .list({lastId: event.lastId, search: event.search}, event.canceler) as ListResponse<CodeRepository>;
        }
    }
</script>
