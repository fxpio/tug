<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row no-gutters justify="center" align="center">
            <v-col cols="12" align="center">
                <v-subheader></v-subheader>
                <lottie transform="scale(2.6)" width="180px" height="180px;" :options="{animationData: iconData}"></lottie>
                <h3 class="mb-5 text--secondary">{{ $t('app.description') }}</h3>
                <v-btn depressed rounded ripple color="accent" class="mt-5" :to="{name: 'home'}">
                    {{ $t('views.home.actions.add_repository') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
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
    export default class Home extends Vue {
        public get iconData(): object {
            return  iconData;
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.home.title') as string,
            };
        }
    }
</script>
