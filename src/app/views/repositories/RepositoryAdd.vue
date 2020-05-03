<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row no-gutters justify="center" align-content="space-between">
            <v-col cols="12" sm="10" md="8" xl="6">
                <v-fade-transition mode="out-in">
                    <loading v-if="loading" class="mt-5"></loading>

                    <div v-else>
                        <v-subheader class="primary--text">
                            {{ $t('views.repositories.title') }}
                        </v-subheader>

                        <v-card flat>
                            <repository-form-add
                                    :title="$t('views.repositories-add.title')"
                                    @added="repositoryAdded"
                                    @cancel="$routerBack.back()"
                            ></repository-form-add>
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
    import RepositoryFormAdd from '@app/components/repositories/RepositoryFormAdd.vue';
    import {RepositoryResponse} from '@app/api/models/responses/RepositoryResponse';
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
    import {MetaInfo} from 'vue-meta';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {RepositoryFormAdd, Loading},
    })
    export default class RepositoryAdd extends mixins(AjaxContent) {
        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.repositories-add.title') as string,
            };
        }

        public repositoryAdded(repository: RepositoryResponse): void {
            this.$router.push({name: 'repositories'});
            this.$snackbar.snack(new SnackbarMessage(repository.message, 'success'));
        }
    }
</script>
