<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-navigation-drawer v-model="drawer" fixed clipped app>
        <v-fade-transition>
        <v-list rounded v-if="$store.state.auth.authenticated">
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
                        active-class="primary white--text white--icon"
                        :ripple="false"
                        :key="i"
                        :to="item.route"
                        :dense="item.dense"
                        @click.stop="eventClick(item.click)"
                >
                    <v-list-item-action>
                        <v-icon :color="item.color" :dense="item.dense">{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title :class="item.textClass">
                            {{ $t(item.text) }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <template v-for="(slotItem) in getSlotItems('list')"
                      v-slot:[slotItem.target]>
                <slot :name="slotItem.original"></slot>
            </template>
        </v-list>
        </v-fade-transition>

        <template v-for="(slotItem) in getSlotItems('drawer')"
                  v-slot:[slotItem.target]>
            <slot :name="slotItem.original"></slot>
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {SlotWrapper} from '@app/mixins/SlotWrapper';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class AppDrawer extends mixins(SlotWrapper) {
        @Prop(Array)
        public items!: object[];

        public get drawer(): boolean {
            return this.$store.state.drawer.show;
        }

        public set drawer(value) {
            this.$store.commit('drawer/toggle', value as boolean);
        }

        public eventClick(callable?: Function): void {
            if (callable) {
                callable();
            }
        }
    }
</script>
