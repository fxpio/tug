<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row no-gutters justify="center">
            <v-col cols="12" sm="10" md="8" xl="6">
                <v-subheader :class="$classes('mt-4 primary--text', 'text--lighten-3')">
                    {{ $t('views.about.title') }}
                </v-subheader>

                <v-card flat>
                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon color="accent">history</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('views.about.fields.version') }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ version }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item target="_blank" href="https://github.com/fxpio/tug/issues">
                            <v-list-item-avatar>
                                <v-icon color="accent">bug_report</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('views.about.fields.bug-report') }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ $t('views.about.fields.bug-report-description') }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item target="_blank" href="https://github.com/fxpio/tug/releases">
                            <v-list-item-avatar>
                                <v-icon color="accent">track_changes</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('views.about.fields.changelog') }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-subheader :class="$classes('mt-4 primary--text', 'text--lighten-3')">
                    {{ $t('views.about.sections.author') }}
                </v-subheader>

                <v-card flat>
                    <v-list two-line>
                        <v-list-item target="_blank" :href="authorGithubUrl">
                            <v-list-item-avatar>
                                <v-icon color="accent">person</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ authorFullName }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ authorGithubName }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item target="_blank" href="https://github.com/fxpio/tug">
                            <v-list-item-avatar>
                                <v-icon color="accent">fab fa-github</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('views.about.fields.fork-on-github') }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item :href="'mailto:' + authorEmail">
                            <v-list-item-avatar>
                                <v-icon color="accent">email</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('views.about.fields.send-an-email') }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ authorEmail }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
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

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class About extends Vue {
        public get version(): string {
            return __VERSION__;
        }

        public get authorFullName(): string {
            return 'François Pluchino';
        }

        public get authorGithubName(): string {
            return 'francoispluchino';
        }

        public get authorEmail(): string {
            return 'francois.pluchino@gmail.com';
        }

        public get authorGithubUrl(): string {
            return 'https://github.com/francoispluchino';
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.about.title') as string,
            };
        }
    }
</script>
