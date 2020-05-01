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
                        <v-subheader class="primary--text">
                            {{ $t('views.repositories.title') }}
                        </v-subheader>

                        <v-card flat>
                            <v-container>
                                <v-row>
                                    <col-label :label="$t('views.repositories.type')">
                                        <repository-service :type="repo.type"></repository-service>
                                    </col-label>

                                    <col-label :label="$t('views.repositories.url')">
                                        <a :href="repo.url" target="_blank">{{ repo.url }}</a>
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
                                        <v-chip color="primary" v-if="!!repo.rootIdentifier">
                                            {{ repo.rootIdentifier }}
                                        </v-chip>

                                        <v-icon v-else color="warning">
                                            fa-exclamation-triangle
                                        </v-icon>
                                    </col-label>
                                </v-row>

                                <v-row>
                                    <col-spacer></col-spacer>
                                    <col-label :label="$t('views.repositories.last-hash')">
                                        <v-chip v-if="!!repo.lastHash">
                                            {{ repo.lastHash }}
                                        </v-chip>

                                        <v-icon v-else color="warning">
                                            fa-exclamation-triangle
                                        </v-icon>
                                    </col-label>
                                </v-row>
                            </v-container>
                        </v-card>
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
    import {Repositories} from '@app/api/services/Repositories';
    import {CodeRepository} from '@app/api/models/responses/CodeRepository';
    import NotFound from '@app/views/NotFound.vue';
    import ColLabel from '@app/components/grid/ColLabel.vue';
    import RepositoryService from '@app/components/repositories/RepositoryService.vue';
    import ColSpacer from '@app/components/grid/ColSpacer.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {ColSpacer, RepositoryService, ColLabel, NotFound, Loading},
    })
    export default class RepositoryView extends mixins(AjaxContent) {
        private repo: CodeRepository|null = null;

        public async created(): Promise<void> {
            const id: string = this.$route.params.id;

            this.repo = await this.fetchData((canceler) => {
                return this.$api.get<Repositories>(Repositories).show(id, canceler);
            }, false);

            this.loading = false;
        }
    }
</script>
