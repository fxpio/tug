/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {ListResponse} from '@app/api/models/responses/ListResponse';
import {getRequestErrorMessage} from '@app/utils/error';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {RequestError} from '@app/errors/RequestError';
import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxListContent<I extends object> extends Vue {
    public loading: boolean = false;

    public headers: object[] = [];

    public items: I[] = [];

    public lastId: string | null = null;

    public search: string = '';

    public previousError: RequestError | null = null;

    protected previousRequest?: Canceler;

    public beforeDestroy(): void {
        this.previousError = null;

        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }

    /**
     * Fetch data.
     *
     * @param {string}  [searchValue] The search value
     * @param {boolean} showSnackbar  Check if the error message must be displayed
     */
    public async fetchData(searchValue?: string, showSnackbar: boolean = false): Promise<void> {
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

            this.lastId = res.lastId;
            this.items = undefined !== searchValue ? [] : this.items;

            for (const result of res.results) {
                this.items.push(result);
            }
        } catch (e) {
            const message = getRequestErrorMessage(this, e);
            this.previousError = new RequestError(e, message);
            this.loading = false;

            if (showSnackbar) {
                this.$snackbar.snack(new SnackbarMessage(message, 'error'));
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
