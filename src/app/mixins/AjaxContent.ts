/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {RequestError} from '@app/errors/RequestError';
import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
import {getRequestErrorMessage} from '@app/utils/error';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxContent extends Vue {
    public loading: boolean = false;

    public previousError: RequestError | null = null;

    public previousRequest?: Canceler;

    public beforeDestroy(): void {
        this.previousError = null;

        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }

    /**
     * Fetch data.
     */
    public async fetchData<D>(request: (canceler: Canceler) => Promise<D>,
                              showSnackbar: boolean = false): Promise<D | undefined> {
        try {
            this.loading = true;
            this.previousError = null;

            if (this.previousRequest) {
                this.previousRequest.cancel();
            }
            this.previousRequest = new Canceler();

            const res: D = await request(this.previousRequest);
            this.previousRequest = undefined;

            return res as D;
        } catch (e) {
            const message = getRequestErrorMessage(this, e);
            this.previousError = new RequestError(e, message);
            this.loading = false;

            if (showSnackbar) {
                this.$snackbar.snack(new SnackbarMessage(message, 'error'));
            }
        }
    }
}
