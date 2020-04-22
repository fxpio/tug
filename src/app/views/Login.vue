<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog v-model="model" eager persistent fullscreen hide-overlay transition="fade">
        <v-card class="fill-height">
        <v-container fill-height>
            <v-row no-gutters justify="center" align-content="center">
                <v-col cols="12" sm="8" md="6" lg="5" xl="3">
                    <v-row justify="center">
                        <lottie transform="scale(2.6)" width="140px" height="140px;" :options="{animationData: iconData, loop: true}"></lottie>
                    </v-row>

                    <h1 class="pb-4 text-center accent--text">{{ $t('app.name') }}</h1>

                    <v-card flat class="pb-2">
                        <v-card-title primary-title>
                            <div class="headline primary--text">
                                {{ $t('views.login.title') }}
                            </div>
                        </v-card-title>

                        <v-card-text class="pb-0">
                            <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="null !== formAlert">
                                {{ formAlert }}
                            </v-alert>

                            <v-form ref="form" @submit.prevent>
                                <v-text-field
                                        type="text"
                                        :label="$i18n.t('views.login.username')"
                                        v-model="username"
                                        data-vv-name="username"
                                        :data-vv-as="$i18n.t('views.login.username')"
                                        v-validate="'required'"
                                        :error-messages="errors.collect('username')"
                                        @keydown.enter="login"
                                        outlined
                                        clearable
                                        autofocus
                                        :readonly="$store.state.auth.authenticationPending"
                                        required>
                                </v-text-field>

                                <v-text-field
                                        :label="$i18n.t('views.login.password')"
                                        v-model="password"
                                        data-vv-name="password"
                                        :data-vv-as="$i18n.t('views.login.password')"
                                        v-validate="'required'"
                                        :error-messages="errors.collect('password')"
                                        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                        :type="showPassword ? 'text' : 'password'"
                                        @click:append="showPassword = !showPassword"
                                        @keydown.enter="login"
                                        outlined
                                        clearable
                                        :readonly="$store.state.auth.authenticationPending"
                                        required>
                                </v-text-field>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="accent"
                                   depressed
                                   raised
                                   ripple
                                   block
                                   rounded
                                   :loading="$store.state.auth.authenticationPending"
                                   :disabled="$store.state.auth.authenticationPending"
                                   @click="login">
                                {{$t('views.login.title')}}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {getRequestErrorMessage} from '@app/utils/error';
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import Lottie from '@app/components/Lottie.vue';
    import Loading from '@app/components/Loading.vue';
    import WallMessage from '@app/components/WallMessage.vue';
    import iconData from '@app/assets/animations/warehouseIcon.json';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {Lottie, Loading, WallMessage},
    })
    export default class Login extends Vue {
        public formAlert: string|null = null;

        public username?: string|null = null;

        public password?: string|null = null;

        public showPassword: boolean = false;

        public model: boolean = true;

        public get iconData(): object {
            return  iconData;
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.login.title') as string,
            };
        }

        public created(): void {
            // Vee validate detects a null value as an entered value
            // and the properties must be initialized with a value.
            // To remove the error messages, the values must be undefined
            this.username = undefined;
            this.password = undefined;
        }

        public async mounted(): Promise<void> {
            this.username = this.$store.state.auth.username;
            this.password = this.$store.state.auth.password;
        }

        public async beforeDestroy(): Promise<void> {
            await this.$store.dispatch('auth/cancel');
        }

        public async login(): Promise<void> {
            if (await this.$validator.validateAll()) {
                try {
                    await this.$store.dispatch('auth/login', {
                        username: this.username,
                        password: this.password,
                    });
                } catch (e) {
                    this.formAlert = getRequestErrorMessage(this, e);
                }
            }
        }
    }
</script>
