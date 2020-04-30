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
                        {{ $t('views.api-keys.no-items') }}
                    </template>

                    <template v-slot:no-items>
                        <v-btn depressed rounded ripple color="accent" class="mt-5" :to="{name: 'api-keys-add'}">
                            {{ $t('views.api-keys.add-first') }}
                        </v-btn>
                    </template>

                    <template v-slot:header>
                        <v-subheader class="mt-4 mb-4 primary--text">
                            <lottie width="48px" :options="{animationData: iconData}"></lottie>
                            {{ $t('views.api-keys.title') }}
                        </v-subheader>
                    </template>

                    <template v-slot:data-table.item.fingerprint="{item}">
                        <span>{{ item.fingerprint ? item.fingerprint : $t('views.api-keys.no-fingerprint') }}</span>
                    </template>

                    <template v-slot:data-table.item.token="{item}">
                        <span>{{ item.id }}</span>
                    </template>

                    <template v-slot:data-table.item.createdAt="{item}">
                        <span>{{ $fdt(item.createdAt) }}</span>
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
    import iconData from '@app/assets/animations/keyIcon.json';
    import {ListResponse} from '@app/api/models/responses/ListResponse';
    import {ApiKey} from '@app/api/models/responses/ApiKey';
    import {FetchRequestDataEvent} from '@app/events/requests/FetchRequestDataEvent';
    import {ApiKeys as ApiApiKeys} from '@app/api/services/ApiKeys';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {SearchList, Lottie},
    })
    export default class ApiKeys extends Vue {
        public get iconData(): object {
            return  iconData;
        }

        public get headers(): object[] {
            return [
                {   text: this.$i18n.t('views.api-keys.fingerprint'),
                    align: 'left',
                    sortable: false,
                    value: 'fingerprint',
                },
                {   text: this.$i18n.t('views.api-keys.token'),
                    align: 'left',
                    sortable: false,
                    value: 'token',
                },
                {   text: this.$i18n.t('views.api-keys.created-at'),
                    align: 'left',
                    sortable: false,
                    value: 'createdAt',
                },
            ];
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.api-keys.title') as string,
            };
        }

        public async fetchDataRequest(event: FetchRequestDataEvent<ListResponse<ApiKey>>): Promise<ListResponse<ApiKey>> {
            return await this.$api.get<ApiApiKeys>(ApiApiKeys)
                .list({lastId: event.lastId, search: event.search}, event.canceler) as ListResponse<ApiKey>;
        }
    }
</script>
