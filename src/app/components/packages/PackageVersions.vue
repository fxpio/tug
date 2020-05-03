<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <loading v-if="loading" class="mt-5"></loading>

        <v-card flat v-else-if="!repository.packageName || 0 === Object.keys(packages).length">
            <slot name="no-package">
                <v-card-text class="text-center">
                    <span>{{ $t('views.packages.no-items') }}</span>
                </v-card-text>
            </slot>
        </v-card>

        <v-card flat v-else>
            <v-data-table
                    :headers="headers"
                    :items="packageList"
                    :loading="loading"
                    item-key="version"
                    hide-default-footer
                    disable-filtering
                    disable-sort
            >
                <template v-slot:item.version="{item}">
                    <v-chip :color="item.version.startsWith('dev-') ? 'secondary' : 'success'"
                            small
                    >
                        {{ item.version }}
                    </v-chip>
                </template>

                <template v-slot:item.time="{item}">
                    {{ $fdt(item.time) }}
                </template>

                <template v-slot:item.actions="{item}">
                    <delete-action
                            :title="$t('views.packages.title')"
                            :data="item"
                            outlined
                            rounded
                            small
                            :delete-call="deleteVersion"
                            @deleted="onVersionDeleted"
                    >
                    </delete-action>
                </template>
            </v-data-table>
        </v-card>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Model} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import Loading from '@app/components/Loading.vue';
    import {Canceler} from '@app/api/Canceler';
    import {Packages} from '@app/api/services/Packages';
    import {CodeRepository} from '@app/api/models/responses/CodeRepository';
    import {MapObject} from '@app/api/models/MapObject';
    import {Package} from '@app/api/models/responses/Package';
    import RefreshPackageAction from '@app/components/packages/RefreshPackageAction.vue';
    import DeleteAction from '@app/components/DeleteAction.vue';
    import {PackageDeleteRequest} from '@app/api/models/requests/PackageDeleteRequest';
    import {PackageDeleteResponse} from '@app/api/models/responses/PackageDeleteResponse';
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {DeleteAction, RefreshPackageAction, Loading},
    })
    export default class PackageVersions extends mixins(AjaxContent) {
        @Model()
        public repository: CodeRepository;

        private packages: MapObject<Package> = {};

        public get packageList(): Package[] {
            return Object.values<Package>(this.packages);
        }

        public get headers(): object[] {
            return [
                {   text: this.$i18n.t('views.packages.version'),
                    value: 'version',
                },
                {   text: this.$i18n.t('views.packages.time'),
                    value: 'time',
                },
                {   align: 'right',
                    value: 'actions',
                },
            ];
        }

        public async created(): Promise<void> {
            await this.refresh();
        }

        public async refresh(): Promise<void> {
            const res = await this.fetchData((canceler: Canceler) => {
                return this.$api.get<Packages>(Packages).getAll(this.repository.packageName as string, canceler);
            }, true);

            this.packages = res as MapObject || {};
            this.loading = false;
        }

        public async deleteVersion(composerPackage: Package, canceler: Canceler): Promise<PackageDeleteResponse> {
            const data = {
                url: this.repository ? this.repository.url : undefined,
                version: composerPackage.version,
            } as PackageDeleteRequest;

            return this.$api.get<Packages>(Packages).delete(data, canceler);
        }

        public async onVersionDeleted(res: PackageDeleteResponse) {
            this.$snackbar.snack(new SnackbarMessage(res.message, 'success'));
        }
    }
</script>
