<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <loading v-if="firstLoading"></loading>

        <wall-message :message="$t('views.repositories.no-items')" v-else-if="hasNoItems">
            <template v-slot:icon>
                <slot name="no-items-icon"></slot>
            </template>

            <template v-slot:default>
                <slot name="no-items"></slot>
            </template>
        </wall-message>

        <v-card flat v-else>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    :loading="loading"
                    hide-default-footer
                    item-key="id">

                <template v-for="(values) in dataTableSlots"
                          v-slot:[values[1]]="{
                            expand,
                            group,
                            groupBy,
                            groupedItems,
                            header,
                            headers,
                            index,
                            isExpanded,
                            isMobile,
                            isOpen,
                            isSelected,
                            item,
                            items,
                            itemsLength,
                            on,
                            options,
                            pageStart,
                            pageStop,
                            pagination,
                            props,
                            remove,
                            select,
                            sort,
                            toggle,
                            updateOptions,
                            value,
                            widths,
                          }"
                >
                    <slot :name="values[0]"
                          :expand="expand"
                          :group="group"
                          :groupBy="groupBy"
                          :groupedItems="groupedItems"
                          :header="header"
                          :headers="headers"
                          :index="index"
                          :isExpanded="isExpanded"
                          :isMobile="isMobile"
                          :isOpen="isOpen"
                          :isSelected="isSelected"
                          :item="item"
                          :items="items"
                          :itemsLength="itemsLength"
                          :on="on"
                          :options="options"
                          :pageStart="pageStart"
                          :pageStop="pageStop"
                          :pagination="pagination"
                          :props="props"
                          :remove="remove"
                          :select="select"
                          :sort="sort"
                          :toggle="toggle"
                          :updateOptions="updateOptions"
                          :value="value"
                          :widths="widths"
                    ></slot>
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
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxListContent} from '@app/mixins/AjaxListContent';
    import Loading from '@app/components/Loading.vue';
    import WallMessage from '@app/components/WallMessage.vue';
    import Lottie from '@app/components/Lottie.vue';
    import {ListResponse} from '@app/api/models/responses/ListResponse';
    import {FetchRequestDataEvent} from '@app/events/requests/FetchRequestDataEvent';
    import {FetchRequestDataFunction} from '@app/events/requests/FetchRequestDataFunction';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {Lottie, WallMessage, Loading},
    })
    export default class SearchList extends mixins(AjaxListContent) {


        @Prop({type: Function, required: true})
        public fetchRequest: FetchRequestDataFunction;

        public get dataTableSlots(): Map<string, string> {
            const map = new Map();

            for (const slotName of Object.keys(this.$scopedSlots)) {
                if (slotName.startsWith('data-table.')) {
                    map.set(slotName, slotName.substring(11));
                }
            }
            return map;
        }

        public async created(): Promise<void> {
            this.headers = this.$attrs.headers as any ?? [];

            await this.fetchData();
        }

        public mounted(): void {
            this.$root.$on('toolbar-search-out', async (searchValue: string) => {
                this.search = searchValue;
            });

            this.$root.$emit('toolbar-search-refresh');
        }

        public destroyed() {
            this.$root.$off('toolbar-search-out');
        }

        @Watch('search')
        public async searchRequest(searchValue?: string): Promise<void> {
            this.$root.$emit('toolbar-search-in', searchValue);
            await this.fetchData(searchValue);
        }

        public async fetchDataRequest(searchValue?: string): Promise<ListResponse<object>> {
            const event = new FetchRequestDataEvent();
            event.lastId = this.lastId;
            event.search = searchValue ? searchValue : null;
            event.canceler = this.previousRequest;

            const res = await this.fetchRequest(event);
            this.loading = false;

            return res;
        }
    }
</script>
