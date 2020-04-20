<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition>
        <v-app-bar app clipped-left elevate-on-scroll>
            <slot name="menu">
                <v-scale-transition origin="center center" mode="out-in">
                    <v-app-bar-nav-icon v-if="!showPreviousButton" @click.prevent="drawerButtonAction" key="menu-btn">
                        <v-icon>menu</v-icon>
                    </v-app-bar-nav-icon>

                    <v-btn icon v-else @click.prevent="previousButtonAction" @long-click="drawerButtonAction"
                           key="previous-btn">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                </v-scale-transition>
            </slot>

            <slot name="title">
                <v-toolbar-title>{{ $t('app.name') }}</v-toolbar-title>
            </slot>

            <slot name="default">
                <v-spacer></v-spacer>
            </slot>

            <slot name="online-status">
                <online-status></online-status>
            </slot>

            <slot name="actions"></slot>
        </v-app-bar>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import OnlineStatus from '@app/components/OnlineStatus.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {OnlineStatus},
    })
    export default class Toolbar extends Vue {
        public showPreviousButton: boolean = false;

        private unSyncRouterHook?: Function;

        public created(): void {
            const self = this;

            this.showPreviousButton = !this.$routerBack.isRoot();

            this.unSyncRouterHook = this.$router.afterEach(() => {
                self.showPreviousButton = !self.$routerBack.isRoot();
            });
        }

        public beforeDestroy(): void {
            if (this.unSyncRouterHook) {
                this.unSyncRouterHook();
                this.unSyncRouterHook = undefined;
            }
        }

        public drawerButtonAction(): void {
            this.$store.commit('drawer/toggle');
        }

        public async previousButtonAction(): Promise<void> {
            await this.$routerBack.back();
        }
    }
</script>
