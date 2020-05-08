/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {ListResponse} from '@app/api/models/responses/ListResponse';
import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
import {BaseAjaxContent} from '@app/mixins/BaseAjaxContent';
import {getRequestErrorMessage} from '@app/utils/error';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxListContent<I extends object> extends BaseAjaxContent {
    public headers: object[] = [];

    public items: I[] = [];

    public count: number|null = null;

    public total: number|null = null;

    public lastId: string | null = null;

    public search: string = '';

    public get firstLoading(): boolean {
        return null === this.count && this.loading;
    }

    public get hasNoItems(): boolean {
        return !this.count && !this.search;
    }

    /**
     * Delete the item by the unique key.
     *
     * @param {string|number} value The value unique key
     * @param {string}        key   The property name of the key
     */
    public deleteItem(value: string|number, key: string = 'id'): number {
        const res = this.items.findIndex((item: any) => {
            return item[key] === value;
        });

        if (res >= 0) {
            this.items.splice(res, 1);

            if (this.count) {
                this.count--;
            }

            if (this.total) {
                this.total--;
            }
        }

        return res;
    }

    public async refresh(showSnackbar: boolean = true): Promise<void> {
        this.lastId = null;
        await this.fetchData(this.search, showSnackbar);
    }

    /**
     * Fetch data.
     *
     * @param {string}  [searchValue] The search value
     * @param {boolean} showSnackbar  Check if the error message must be displayed
     */
    public async fetchData(searchValue?: string, showSnackbar: boolean = true): Promise<void> {
        try {
            this.loading = true;
            this.previousError = null;
            this.lastId = undefined !== searchValue ? null : this.lastId;

            if (this.previousRequest) {
                this.previousRequest.cancel();
            }
            this.previousRequest = new Canceler();

            const res = await this.fetchDataRequest(searchValue);
            this.previousRequest = undefined;

            this.lastId = res.lastId ?? null;
            this.items = undefined !== searchValue ? [] : (this.items ?? []);
            this.count = res.count ?? null;
            this.total = res.total ?? null;

            for (const result of (res.results ?? [])) {
                this.items.push(result);
            }
        } catch (e) {
            this.previousError = e;
            this.previousRequest = undefined;
            this.loading = false;

            if (showSnackbar) {
                this.$snackbar.snack(new SnackbarMessage(getRequestErrorMessage(this, e), 'error'));
            }
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
