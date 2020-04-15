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
import {Repositories as ApiRepositories} from '@app/api/services/Repositories';
import {AjaxListContent} from '@app/mixins/AjaxListContent';
import WithRender from '@app/pages/Repositories/template.html';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Repositories extends mixins(AjaxListContent)
{
    public metaInfo(): MetaInfo {
        return {
            title: this.$i18n.t('page.repositories.title') as string
        };
    }

    public async created(): Promise<void> {
        this.headers = [
            {   text: this.$i18n.t('page.repositories.package-name'),
                align: 'left',
                sortable: false,
                value: 'name'
            },
            {   text: this.$i18n.t('page.repositories.url'),
                align: 'left',
                sortable: false,
                value: 'url'
            }
        ];

        this.$eventBus.$on('repository-search-out', async (searchValue: string) => {
            this.search = searchValue;
        });

        await this.fetchData();
    }

    public destroyed() {
        this.$eventBus.$off('repository-search-out');
    }

    @Watch('search')
    public async searchRequest(searchValue?: string): Promise<void> {
        this.$eventBus.$emit('repository-search-in', searchValue);
        await this.fetchData(searchValue);
    }

    public async fetchDataRequest(searchValue?: string): Promise<ListResponse<CodeRepository>> {
        return await this.$api.get<ApiRepositories>(ApiRepositories)
            .list({lastId: this.lastId, search: this.search ? this.search : null}, this.previousRequest);
    }
}
