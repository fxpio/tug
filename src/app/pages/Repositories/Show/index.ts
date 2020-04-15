/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {Repositories as ApiRepositories} from '@app/api/services/Repositories';
import WithRender from '@app/pages/Repositories/template.html';
import Vue from 'vue';
import {MetaInfo} from 'vue-meta';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class RepositoryShow extends Vue
{
    public metaInfo(): MetaInfo {
        return {
            title: this.$i18n.t('page.repositories.title') as string
        };
    }

    public loading: boolean = false;

    public headers: object[] = [];

    public items: object[] = [];

    public lastId: string|null = null;

    public search: string = '';

    private previousRequest?: Canceler;

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

        await this.fetchData();
    }

    @Watch('search')
    public async fetchData(searchValue?: string): Promise<void> {
        this.loading = true;
        this.lastId = undefined !== searchValue ? null : this.lastId;

        if (this.previousRequest) {
            this.previousRequest.cancel();
        }
        this.previousRequest = new Canceler();

        let res = await this.$api.get<ApiRepositories>(ApiRepositories)
            .list({lastId: this.lastId, search: this.search ? this.search : null}, this.previousRequest);
        this.previousRequest = undefined;

        if (res) {
            this.loading = false;
            this.lastId = res.lastId;
            this.items = undefined !== searchValue ? [] : this.items;

            for (let i = 0; i < res.results.length; ++i) {
                this.items.push(res.results[i]);
            }
        }
    }
}
