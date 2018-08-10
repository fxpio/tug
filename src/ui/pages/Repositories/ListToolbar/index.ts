/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WithRender from '@app/ui/pages/Repositories/ListToolbar/template.html';
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Toolbar extends Vue
{
    public search: string = '';

    public async created(): Promise<void> {
        this.$eventBus.$on('repository-search-in', async (searchValue: string) => {
            this.search = searchValue;
        });
    }

    public destroyed() {
        this.$eventBus.$off('repository-search-in');
    }

    @Watch('search')
    public async searchRequest(searchValue?: string): Promise<void> {
        this.$eventBus.$emit('repository-search-out', searchValue);
    }
}
