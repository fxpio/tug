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
                        <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                            {{ $t('views.api-keys.title') }}
                        </v-subheader>

                        <v-card flat>
                            <api-key-form-add
                                    :title="$t('views.api-keys-add.title')"
                                    @added="apiKeyAdded"
                                    @cancel="$routerBack.back()"
                            ></api-key-form-add>
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
    import ApiKeyFormAdd from '@app/components/api-keys/ApiKeyFormAdd.vue';
    import {ApiKeyResponse} from '@app/api/models/responses/ApiKeyResponse';
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
    import {MetaInfo} from 'vue-meta';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {ApiKeyFormAdd, Loading},
    })
    export default class ApiKeyAdd extends mixins(AjaxContent) {
        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.api-keys-add.title') as string,
            };
        }

        public apiKeyAdded(apiKey: ApiKeyResponse): void {
            this.$router.push({name: 'api-keys'});
            this.$snackbar.snack(new SnackbarMessage(apiKey.message, 'success'));
        }
    }
</script>
