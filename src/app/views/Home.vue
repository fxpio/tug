<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container fill-height>
        <v-row no-gutters justify="center" align="center">
            <v-col cols="12" align="center">
                <v-icon size="14em" color="accent">loyalty</v-icon>
                <h1 class="pb-4 accent--text">{{ $t('app.name') }}</h1>
                <h3>{{ $t('app.description') }}</h3>
                <v-btn color="accent" ripple class="mt-3" :to="{name: 'home'}">{{ $t('views.home.actions.add_repository') }}</v-btn>
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
    export default class Home extends Vue {
        public metaInfo(): MetaInfo {
            return {
                title: this.$t('views.home.title') as string,
            };
        }
    }
</script>
