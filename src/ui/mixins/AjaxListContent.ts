/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/ui/api/Canceler';
import {ListResponse} from '@app/ui/api/models/responses/ListResponse';
import {getRequestErrorMessage} from '@app/ui/utils/error';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxListContent<I extends object> extends Vue
{
    public loading: boolean = false;

    public headers: object[] = [];

    public items: I[] = [];

    public lastId: string|null = null;

    public search: string = '';

    protected previousRequest?: Canceler;

    /**
     * Fetch data.
     *
     * @param {string} [searchValue] The search value
     */
    public async fetchData(searchValue?: string): Promise<void> {
        try {
            this.loading = true;
            this.lastId = undefined !== searchValue ? null : this.lastId;

            if (this.previousRequest) {
                this.previousRequest.cancel();
            }
            this.previousRequest = new Canceler();

            let res = await this.fetchDataRequest(searchValue);
            this.previousRequest = undefined;

            this.loading = false;
            this.lastId = res.lastId;
            this.items = undefined !== searchValue ? [] : this.items;

            for (let i = 0; i < res.results.length; ++i) {
                this.items.push(res.results[i]);
            }
        } catch (e) {
            this.loading = false;
            this.$store.commit('snackbar/snack', {message: getRequestErrorMessage(this, e), color: 'error'});
        }
    }

    /**
     * Request of fetch data.
     *
     * @param {string} [searchValue] The search value
     */
    public async fetchDataRequest(searchValue?: string): Promise<ListResponse<I>> {
        return {} as ListResponse<I>;
    }
}
