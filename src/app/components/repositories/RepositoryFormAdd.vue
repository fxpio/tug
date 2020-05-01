<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div>
        <v-card-title class="primary--text">
            {{ title }}
        </v-card-title>

        <v-card-text class="pt-4 pb-0">
            <v-alert type="error" class="mb-4" transition="scale-transition" mode="out-in" :value="showFormAlert">
                {{ formAlert }}
            </v-alert>

            <v-form ref="form" @submit.prevent>
                <v-text-field
                        type="text"
                        :label="$i18n.t('views.repositories.url')"
                        v-model="url"
                        :error-messages="fieldErrors('url')"
                        @keydown.enter="save"
                        outlined
                        clearable
                        autofocus
                        :disabled="loading"
                        :rules="[$r('required')]"
                >
                </v-text-field>

                <v-switch
                        :label="$i18n.t('views.repositories-add.type-manual')"
                        :disabled="loading"
                        v-model="manualType"
                        class="mt-0"
                ></v-switch>

                <v-slide-x-reverse-transition>
                    <v-text-field
                            v-if="manualType"
                            type="text"
                            :label="$i18n.t('views.repositories.type')"
                            v-model="type"
                            :error-messages="fieldErrors('type')"
                            @keydown.enter="save"
                            outlined
                            clearable
                            :disabled="loading"
                            :rules="[$r('required')]"
                    >
                    </v-text-field>
                </v-slide-x-reverse-transition>
            </v-form>
        </v-card-text>

        <v-card-actions class="mt-3">
            <v-spacer></v-spacer>

            <v-btn text
                   ripple
                   rounded
                   :disabled="loading"
                   @click="$emit('cancel')">
                {{ $t('cancel') }}
            </v-btn>

            <v-btn color="accent"
                   depressed
                   ripple
                   rounded
                   :loading="loading"
                   :disabled="loading"
                   @click="save">
                {{ $t('save') }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@app/mixins/AjaxFormContent';
    import {Canceler} from '@app/api/Canceler';
    import {Repositories} from '@app/api/services/Repositories';
    import {RepositoryRequest} from '@app/api/models/requests/RepositoryRequest';
    import {RepositoryResponse} from '@app/api/models/responses/RepositoryResponse';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class RepositoryFormAdd extends mixins(AjaxFormContent) {
        @Prop({type: String, required: true})
        public title: string;

        public url?: string|null = null;

        public manualType: boolean = false;

        public type?: string|null = null;

        public async save(): Promise<void> {
            if (this.isValidForm()) {
                const data = {
                    url: this.url ? this.url : undefined,
                    type: this.type ? this.type : undefined,
                } as RepositoryRequest;
                const res = await this.fetchData<RepositoryResponse>((canceler: Canceler) => {
                    return this.$api.get<Repositories>(Repositories).enable(data, canceler);
                }, false);

                if (res) {
                    this.loading = false;
                    this.$emit('added', res);
                }
            }
        }
    }
</script>
