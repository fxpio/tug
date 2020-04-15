/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {getRequestErrorMessage} from '@app/utils/error';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxContent<D> extends Vue
{
    public loading: boolean = false;

    public data?: D;

    protected previousRequest?: Canceler;

    /**
     * Fetch data.
     */
    public async fetchData(): Promise<void> {
        try {
            this.loading = true;

            if (this.previousRequest) {
                this.previousRequest.cancel();
            }
            this.previousRequest = new Canceler();

            let res = await this.fetchDataRequest();
            this.previousRequest = undefined;

            this.loading = false;
            this.data = res ? res : undefined;
        } catch (e) {
            this.loading = false;
            this.$store.commit('snackbar/snack', {message: getRequestErrorMessage(this, e), color: 'error'});
        }
    }

    /**
     * Request of fetch data.
     */
    public async fetchDataRequest(): Promise<D|null> {
        return null;
    }
}
