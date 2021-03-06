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
                <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                    {{ $t('views.settings.account') }}
                </v-subheader>
                <v-card flat>
                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon size="52" :color="$color($store.state.auth.authenticated ? 'primary' : 'grey', $store.state.auth.authenticated ? 'primary lighten-3' : 'grey')">account_circle</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content></v-list-item-content>

                            <v-list-item-action v-if="!$store.state.auth.authenticated">
                                <v-tooltip left eager>
                                    <template v-slot:activator="{on}">
                                        <v-btn
                                                v-on="on"
                                                outlined
                                                small
                                                fab
                                                :color="$color('accent', '')"
                                                ripple
                                                icon
                                                @click="login">
                                            <v-icon>person_add</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('views.login.title') }}</span>
                                </v-tooltip>
                            </v-list-item-action>

                            <v-list-item-action v-if="$store.state.auth.authenticated">
                                <v-tooltip left eager>
                                    <template v-slot:activator="{on}">
                                        <v-btn
                                                v-on="on"
                                                outlined
                                                small
                                                fab
                                                :color="$color('primary lighten-3', '')"
                                                ripple
                                                icon
                                                @click="$store.dispatch('auth/logout', $router.currentRoute.fullPath)">
                                            <v-icon>exit_to_app</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('logout') }}</span>
                                </v-tooltip>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-subheader :class="$classes('mt-4 primary--text', 'text--lighten-3')">
                    {{ $t('views.settings.general') }}
                </v-subheader>
                <v-card flat>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.language') }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-menu eager>
                                    <template v-slot:activator="{on}">
                                        <div class="menu-activator" v-on="on">
                                            <span>{{ selectedLanguage }}</span>
                                            <v-icon>arrow_drop_down</v-icon>
                                        </div>
                                    </template>

                                    <v-list>
                                        <v-list-item
                                                v-for="available in languageAvailables"
                                                :key="available.code"
                                                @click="$store.commit('i18n/setLocale', available.code)"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title v-text="available.label"></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.dark-mode') }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-switch hide-details v-model="darkMode" :color="$color('primary', 'primary lighten-3')"></v-switch>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-subheader :class="$classes('mt-4 primary--text', 'text--lighten-3')">
                    {{ $t('views.settings.github') }}
                </v-subheader>
                <v-card flat>
                    <v-list>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.github.oauth-token') }}</v-list-item-title>
                                <v-list-item-subtitle>{{ $t('views.settings.github.oauth-token.description') }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action class="mt-2 mb-2">
                                <github-oauth-token-action origin="center right"></github-oauth-token-action>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.github.webhook-token') }}</v-list-item-title>
                                <v-list-item-subtitle>{{ $t('views.settings.github.webhook-token.description') }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action class="mt-2 mb-2">
                                <github-token-action origin="center right"></github-token-action>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-subheader :class="$classes('mt-4 primary--text', 'text--lighten-3')">
                    {{ $t('views.settings.gitlab') }}
                </v-subheader>
                <v-card flat>
                    <v-list>
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.gitlab.oauth-token') }}</v-list-item-title>
                                <v-list-item-subtitle>{{ $t('views.settings.gitlab.oauth-token.description') }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action class="mt-2 mb-2">
                                <gitlab-oauth-token-action origin="center right"></gitlab-oauth-token-action>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.gitlab.webhook-token') }}</v-list-item-title>
                                <v-list-item-subtitle>{{ $t('views.settings.gitlab.webhook-token.description') }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action class="mt-2 mb-2">
                                <gitlab-token-action origin="center right"></gitlab-token-action>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import GithubOauthTokenAction from '@app/components/settings/github/GithubOauthTokenAction.vue';
    import GithubTokenAction from '@app/components/settings/github/GithubTokenAction.vue';
    import GitlabOauthTokenAction from '@app/components/settings/gitlab/GitlabOauthTokenAction.vue';
    import GitlabTokenAction from '@app/components/settings/gitlab/GitlabTokenAction.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {GithubTokenAction, GithubOauthTokenAction, GitlabTokenAction, GitlabOauthTokenAction},
    })
    export default class Settings extends Vue {
        public languageAvailables: LanguageAvailable[] = [];

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.settings.title') as string,
            };
        }

        public created(): void {
            for (const available of Object.keys(this.$i18n.messages)) {
                this.languageAvailables.push({
                    code: available,
                    label: this.$t('views.settings.languages.' + available) as string,
                });
            }

            this.languageAvailables.sort((a: LanguageAvailable, b: LanguageAvailable): number => {
                if (a.label < b.label) {
                    return -1;
                } else if (a.label > b.label) {
                    return 1;
                }

                return 0;
            });
        }

        public get selectedLanguage(): string {
            let language = this.$store.state.i18n.locale;
            language = this.$i18n.messages[language] ? language : this.$store.state.i18n.fallback;

            return this.$t('views.settings.languages.' + language) as string;
        }

        public get darkMode(): boolean {
            return this.$store.state.darkMode.enabled;
        }

        public set darkMode(value: boolean) {
            this.$store.commit('darkMode/toggle', value);
        }

        public login(): void {
            this.$router.push({name: 'login'});
        }
    }

    interface LanguageAvailable {
        code: string;
        label: string;
    }
</script>
