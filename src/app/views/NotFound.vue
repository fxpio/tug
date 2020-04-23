<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container fill-height>
        <error-message :message="$t('error.404-page-not-found')">
            <v-btn depressed rounded small color="primary lighten-4" class="mt-5" :to="{name: 'home'}">
                {{ $t('error.go-to-home') }}
            </v-btn>
        </error-message>
    </v-container>
</template>

<script lang="ts">
    import ErrorMessage from '@app/components/ErrorMessage.vue';
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {ErrorMessage},
    })
    export default class NotFound extends Vue {
        public metaInfo(): MetaInfo {
            return {
                title: this.$t('error.404-page-not-found') as string,
            };
        }
    }
</script>
