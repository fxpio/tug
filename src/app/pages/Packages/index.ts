/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CodeRepository} from '@app/api/models/responses/CodeRepository';
import {ListResponse} from '@app/api/models/responses/ListResponse';
import {Packages as ApiPackages} from '@app/api/services/Packages';
import {AjaxListContent} from '@app/mixins/AjaxListContent';
import WithRender from '@app/pages/Packages/template.html';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Packages extends mixins(AjaxListContent)
{
    public metaInfo(): MetaInfo {
        return {
            title: this.$i18n.t('page.packages.title') as string
        };
    }

    public async created(): Promise<void> {
        this.headers = [
            {   text: this.$i18n.t('page.packages.package-name'),
                align: 'left',
                sortable: false,
                value: 'name'
            },
            {   text: this.$i18n.t('page.packages.url'),
                align: 'left',
                sortable: false,
                value: 'url'
            }
        ];

        this.$eventBus.$on('package-search-out', async (searchValue: string) => {
            this.search = searchValue;
        });

        await this.fetchData();
    }

    public destroyed() {
        this.$eventBus.$off('package-search-out');
    }

    @Watch('search')
    public async searchRequest(searchValue?: string): Promise<void> {
        this.$eventBus.$emit('package-search-in', searchValue);
        await this.fetchData(searchValue);
    }

    public async fetchDataRequest(searchValue?: string): Promise<ListResponse<CodeRepository>> {
        return await this.$api.get<ApiPackages>(ApiPackages)
            .list({lastId: this.lastId, search: this.search ? this.search : null}, this.previousRequest);
    }
}
