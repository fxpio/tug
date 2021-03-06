<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-app>
        <snackbar></snackbar>

        <transition :name="transitionName">
            <app-drawer :items="drawerItems" v-if="$store.state.auth.authenticated">
                <template v-slot:drawer.append>
                    <v-list rounded>
                        <v-list-item dense :ripple="false" @click="logout">
                            <v-list-item-icon>
                                <v-icon dense left :color="$color('primary lighten-4', 'primary lighten-3')">exit_to_app</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content :class="$classes('primary--text text--lighten-4', {'text--lighten-3': true, 'text--lighten-4': false})">
                                {{ $t('logout') }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </template>
            </app-drawer>
        </transition>

        <transition :name="transitionName">
            <toolbar v-if="$store.state.auth.authenticated">
                <transition :name="transitionName" mode="out-in">
                    <router-view name="toolbar" :key="$route.fullPath"></router-view>
                </transition>
            </toolbar>
        </transition>

        <v-content>
            <transition :name="transitionName" mode="out-in">
                <router-view :key="$route.fullPath"></router-view>
            </transition>
        </v-content>

        <router-view name="fab"></router-view>
    </v-app>
</template>

<script lang="ts">
    import AppDrawer from '@app/components/AppDrawer.vue';
    import Snackbar from '@app/components/Snackbar.vue';
    import Vue from 'vue';
    import {Component, Watch} from 'vue-property-decorator';
    import {MetaInfo} from 'vue-meta';
    import Toolbar from '@app/components/Toolbar.vue';
    import {Themer} from '@app/themer/Themer';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {Toolbar, AppDrawer, Snackbar},
    })
    export default class App extends Vue {
        public static readonly DEFAULT_TRANSITION: string = 'fade';

        public transitionName: string = App.DEFAULT_TRANSITION;

        public drawerItems: object[] = [
            {icon: 'fa-store', color: ['primary', 'primary lighten-3'], text: 'views.home.title', route: {name: 'home'}},
            {heading: 'menu.composer'},
            {icon: 'add', color: ['primary', 'primary lighten-3'], dense: true, text: 'views.repositories-add.title', route: {name: 'repositories-add-redirect'}},
            {icon: 'fa-folder-open', color: ['primary', 'primary lighten-3'], text: 'views.repositories.title', route: {name: 'repositories'}},
            {heading: 'menu.configuration'},
            {icon: 'add', color: 'grey', dense: true, text: 'views.api-keys-add.title', route: {name: 'api-keys-add-redirect'}},
            {icon: 'fa-key', color: 'grey', text: 'views.api-keys.title', route: {name: 'api-keys'}},
            {icon: 'fa-cog', color: 'grey', text: 'views.settings.title', route: {name: 'settings'}},
            {divider: true},
            {icon: 'fa-info-circle', color: 'grey', text: 'views.about.title', route: {name: 'about'}},
        ];

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.home.title', {}) as string,
                titleTemplate: (titleChunk) => titleChunk + ' · ' + this.$t('app.name'),
            };
        }

        public get darkModeEnabled(): boolean {
            return this.$store.state.darkMode.enabled;
        }

        @Watch('darkModeEnabled')
        public watchDarkMode(enabled: boolean): void {
            this.$vuetify.theme.dark = enabled;
            Themer.updateThemeColor('v-application');
            const htmlEl = document.getElementsByTagName('html')[0];
            htmlEl.classList.remove('theme--light', 'theme--dark');
            htmlEl.classList.add('theme--' + (enabled ? 'dark' : 'light'));
        }

        public created(): void {
            this.watchDarkMode(this.darkModeEnabled);
            this.$router.beforeEach((to, from, next) => {
                let transitionName = to.meta.transitionName || from.meta.transitionName;

                if (transitionName === 'slide') {
                    const toDepth = to.path.split('/').length;
                    const fromDepth = from.path.split('/').length;
                    transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
                }

                this.transitionName = transitionName || App.DEFAULT_TRANSITION;

                next();
            });
        }

        public async mounted(): Promise<void> {
            Themer.updateThemeColor('v-application');
            const pl = document.getElementById('pl');

            if (pl) {
                pl.addEventListener('transitionend', () => {
                    pl.remove();
                    document.getElementsByTagName('html')[0].classList.remove('preloader');
                });
                pl.style.opacity = '0';
            }
        }

        public async logout(): Promise<void> {
            await this.$store.dispatch('auth/logout');
        }
    }
</script>
