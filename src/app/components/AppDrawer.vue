<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-navigation-drawer v-model="drawer" fixed clipped app>
        <v-list shaped>
            <template v-for="(item, i) in items">
                <v-subheader v-if="item.heading" :key="i">
                    {{ $t(item.heading) }}
                </v-subheader>
                <v-divider
                        v-else-if="item.divider"
                        :key="i"
                        dark
                        class="my-3"
                ></v-divider>
                <v-list-item
                        v-else
                        :key="i"
                        :to="item.route"
                >
                    <v-list-item-action>
                        <v-icon :color="item.color">{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t(item.text) }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class AppDrawer extends Vue {
        @Prop(Array)
        public items!: object[];

        public get drawer(): boolean {
            return this.$store.state.drawer.show;
        }

        public set drawer(value) {
            this.$store.commit('drawer/toggle', value as boolean);
        }
    }
</script>
