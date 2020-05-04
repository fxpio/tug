<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-tooltip top>
        <template v-slot:activator="{on}">
            <v-icon v-on="on"
                    v-if="'vcs-github' === type"
                    :color="$color('black', 'grey lighten-2')"
            >
                fab fa-github
            </v-icon>

            <v-icon v-on="on" v-else>
                fa-code-branch
            </v-icon>
        </template>
        <span>{{ type }}</span>
    </v-tooltip>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class RepositoryService extends Vue {
        @Prop({type: String, required: true})
        public type: string;
    }
</script>
