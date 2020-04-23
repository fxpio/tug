<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <tooltip position="left" :message="online ? $t('online') : $t('offline')">
        <v-scale-transition origin="center center" mode="out-in">
            <v-icon :color="online ? 'grey lighten-1' : 'warning'" :key="online">{{ online ? 'cloud_done' : 'cloud_off' }}</v-icon>
        </v-scale-transition>
    </tooltip>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Tooltip from '@app/components/Tooltip.vue';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {Tooltip},
    })
    export default class OnlineStatus extends Vue {
        public online?: boolean = false;

        public beforeMount(): void {
            this.online = window.navigator.onLine;
            window.addEventListener('online', this.onOnline);
            window.addEventListener('offline', this.onOffline);
        }

        public destroyed(): void {
            window.removeEventListener('online', this.onOnline);
            window.removeEventListener('offline', this.onOffline);
        }

        public onOnline(): void {
            this.online = true;
        }

        public onOffline(): void {
            this.online = false;
        }
    }
</script>
