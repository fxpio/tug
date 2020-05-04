<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row no-gutters justify="center" align-content="space-between">
            <v-col>
                <v-fade-transition mode="out-in">
                    <loading v-if="loading" class="mt-5"></loading>
                    <not-found v-else-if="!repo"></not-found>

                    <div v-else>
                        <v-row class="ma-0" align="center">
                            <v-col cols="10" class="ma-0 pa-0">
                                <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                                    <lottie width="48px" :options="{animationData: iconData}"></lottie>
                                    {{ $t('views.repositories.title') }}
                                </v-subheader>
                            </v-col>
                            <v-col cols="2" class="text-right">
                                <v-btn :color="$color('primary', 'primary lighten-2')"
                                       depressed
                                       ripple
                                       rounded
                                       small
                                       @click="refresh()"
                                >
                                    <v-icon small>refresh</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-card flat>
                            <v-container>
                                <v-alert type="warning" v-if="!repo.packageName || !repo.lastHash">
                                    <div>{{ $t('views.repositories.last-hash.no-auto-updated') }}</div>
                                    <div class="caption">{{ $t('views.repositories.last-hash.no-auto-updated.hint') }}</div>
                                </v-alert>

                                <v-row>
                                    <col-label :label="$t('views.repositories.type')">
                                        <repository-service :type="repo.type"></repository-service>
                                    </col-label>

                                    <col-label :label="$t('views.repositories.url')">
                                        <a :href="repo.url"
                                           target="_blank"
                                           :class="$classes('primary--text', 'text--lighten-3')"
                                        >
                                            {{ repo.url }}
                                        </a>
                                    </col-label>
                                </v-row>

                                <v-row>
                                    <col-label :label="$t('views.repositories.package-name')">
                                        <span v-if="!!repo.packageName">
                                            {{ repo.packageName }}
                                        </span>

                                        <v-icon v-else color="warning">
                                            fa-exclamation-triangle
                                        </v-icon>
                                    </col-label>

                                    <col-label :label="$t('views.repositories.root-identifier')">
                                        <v-chip small color="secondary" v-if="!!repo.rootIdentifier">
                                            {{ repo.rootIdentifier }}
                                        </v-chip>

                                        <v-icon v-else color="warning">
                                            fa-exclamation-triangle
                                        </v-icon>
                                    </col-label>
                                </v-row>

                                <v-row>
                                    <col-label :label="$t('views.repositories.download-count')">
                                        {{ $tc('views.repositories.installations', repo.downloadCount ? repo.downloadCount : 0) }}
                                    </col-label>


                                    <col-label :label="$t('views.repositories.last-hash')">
                                        <v-chip small v-if="!!repo.lastHash">
                                            {{ repo.lastHash }}
                                        </v-chip>

                                        <v-icon v-else color="warning">
                                            fa-exclamation-triangle
                                        </v-icon>
                                    </col-label>
                                </v-row>
                            </v-container>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <refresh-package-action
                                        :url="repo.url"
                                        color="accent"
                                        depressed
                                        ripple
                                        :small="false"
                                >
                                </refresh-package-action>

                                <delete-action
                                        :title="$t('views.packages.title') + (repo.packageName ? ' ' + repo.packageName : '')"
                                        :text="$t('views.packages.remove-confirmation')"
                                        v-model="repo"
                                        color="red darken-3"
                                        outlined
                                        :delete-call="deleteAllPackages"
                                        @deleted="onAllPackagesDeleted"
                                >
                                    <template v-slot:btn-icon="{small}">
                                        <v-icon :small="small">delete_sweep</v-icon>
                                    </template>
                                </delete-action>

                                <delete-action
                                        :title="$t('views.repositories.title') + (repo.packageName ? ' ' + repo.packageName : '')"
                                        :text="$t('views.repositories.remove-confirmation')"
                                        v-model="repo"
                                        :delete-call="deleteRepo"
                                        outlined
                                        @deleted="$router.push({name: 'repositories'})"
                                >
                                    <template v-slot:btn-icon="{small}">
                                        <v-icon :small="small">delete_forever</v-icon>
                                    </template>
                                </delete-action>

                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>

                        <!-- Packages -->
                        <v-row class="ma-0 mt-6" align="center">
                            <v-col class="ma-0 pa-0">
                                <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                                    <lottie width="48px" :options="{animationData: iconDataPackage}"></lottie>
                                    {{ $t('views.packages.title') }}
                                </v-subheader>
                            </v-col>
                        </v-row>

                        <package-versions v-model.sync="repo">
                        </package-versions>
                    </div>
                </v-fade-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@app/mixins/AjaxContent';
    import Loading from '@app/components/Loading.vue';
    import {Repositories as ApiRepositories, Repositories} from '@app/api/services/Repositories';
    import {CodeRepository} from '@app/api/models/responses/CodeRepository';
    import NotFound from '@app/views/NotFound.vue';
    import ColLabel from '@app/components/grid/ColLabel.vue';
    import RepositoryService from '@app/components/repositories/RepositoryService.vue';
    import ColSpacer from '@app/components/grid/ColSpacer.vue';
    import DeleteAction from '@app/components/DeleteAction.vue';
    import {RepositoryRequest} from '@app/api/models/requests/RepositoryRequest';
    import {RepositoryResponse} from '@app/api/models/responses/RepositoryResponse';
    import {Canceler} from '@app/api/Canceler';
    import Lottie from '@app/components/Lottie.vue';
    import iconData from '@app/assets/animations/repositoryIcon.json';
    import iconDataPackage from '@app/assets/animations/packageIcon.json';
    import RefreshPackageAction from '@app/components/packages/RefreshPackageAction.vue';
    import {MetaInfo} from 'vue-meta';
    import PackageVersions from '@app/components/packages/PackageVersions.vue';
    import {PackageDeleteResponse} from '@app/api/models/responses/PackageDeleteResponse';
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
    import {Packages} from '@app/api/services/Packages';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {
            PackageVersions,
            RefreshPackageAction,
            Lottie, DeleteAction, ColSpacer, RepositoryService, ColLabel, NotFound, Loading,
        },
    })
    export default class RepositoryView extends mixins(AjaxContent) {
        private repo: CodeRepository|null = null;

        public get iconData(): object {
            return  iconData;
        }

        public get iconDataPackage(): object {
            return  iconDataPackage;
        }

        public metaInfo(): MetaInfo {
            let name = this.repo?.packageName ?? this.repo?.url;
            name = name ?? this.$i18n.t('error.404-page-not-found') as string;

            return {
                title: this.$t('views.repositories.title') as string + ' - ' + name,
            };
        }

        public async created(): Promise<void> {
            await this.refresh();
        }

        public async refresh(): Promise<void> {
            const id: string = this.$route.params.id;

            this.repo = await this.fetchData((canceler) => {
                return this.$api.get<Repositories>(Repositories).show(id, canceler);
            }, false);

            this.loading = false;
        }

        public async deleteRepo(repo: CodeRepository, canceler: Canceler): Promise<RepositoryResponse> {
            const data = {
                url: repo.url,
            } as RepositoryRequest;

            return this.$api.get<ApiRepositories>(ApiRepositories).disable(data, canceler);
        }

        public async deleteAllPackages(repo: CodeRepository, canceler: Canceler): Promise<RepositoryResponse> {
            return this.$api.get<Packages>(Packages).deleteAll(repo.url, canceler);
        }

        public async onAllPackagesDeleted(res: PackageDeleteResponse) {
            this.$snackbar.snack(new SnackbarMessage(res.message, 'success'));
        }
    }
</script>
