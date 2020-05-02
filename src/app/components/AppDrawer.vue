<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-navigation-drawer
            v-model="drawer"
            fixed
            app
            mobile-break-point="920"
            :mini-variant.sync="mini"
            mini-variant-width="72"
    >
        <template v-slot:prepend>
            <v-list rounded>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-btn fab depressed :ripple="false" color="secondary">
                            <v-icon>directions_boat</v-icon>
                        </v-btn>
                    </v-list-item-avatar>

                    <v-list-item-title class="font-weight-bold">
                        {{ $t('app.name') }}
                    </v-list-item-title>

                    <v-btn icon @click.stop="mini = !mini">
                        <v-icon>chevron_left</v-icon>
                    </v-btn>
                </v-list-item>
            </v-list>
        </template>

        <v-list rounded>
            <template v-for="(item, i) in items">
                <v-list-item v-if="item.heading" :key="i">
                    <v-list-item-content>
                        <v-list-item-subtitle>
                            {{ $t(item.heading) }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

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
                    <v-list-item-icon>
                        <v-icon :color="item.color" :dense="item.dense">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
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

        public get mini(): boolean {
            return this.$store.state.drawer.mini;
        }

        public set mini(value) {
            this.$store.commit('drawer/toggleMini', value as boolean);
        }

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
