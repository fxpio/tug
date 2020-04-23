<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="v-toolbar--content">
        <v-spacer></v-spacer>

        <v-text-field
                flat
                solo-inverted
                hide-details
                clearable
                prepend-inner-icon="search"
                :label="$t('search')"
                v-model="search"
                color="accent lighten-2"
                rounded
        ></v-text-field>

        <v-spacer></v-spacer>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class SearchToolbar extends Vue {
        public search: string = '';

        public async created(): Promise<void> {
            this.$root.$on('toolbar-search-in', async (searchValue: string) => {
                this.search = searchValue;
            });

            this.$root.$on('toolbar-search-refresh', async () => {
                this.$root.$emit('toolbar-search-out', this.search);
            });
        }

        public destroyed() {
            this.$root.$off('toolbar-search-in');
            this.$root.$off('toolbar-search-refresh');
        }

        @Watch('search')
        public async searchRequest(searchValue?: string): Promise<void> {
            this.$root.$emit('toolbar-search-out', searchValue);
        }
    }
</script>
