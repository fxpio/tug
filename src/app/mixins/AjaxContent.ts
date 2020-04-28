/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {ApiRequestError} from '@app/api/errors/ApiRequestError';
import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
import {BaseAjaxContent} from '@app/mixins/BaseAjaxContent';
import {getRequestErrorMessage} from '@app/utils/error';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxContent extends BaseAjaxContent {
    /**
     * Fetch data.
     */
    public async fetchData<D>(request: (canceler: Canceler) => Promise<D | null>,
                              showSnackbar: boolean = true): Promise<D | null> {
        try {
            this.loading = true;
            this.previousError = null;

            if (this.previousRequest) {
                this.previousRequest.cancel();
            }
            this.previousRequest = new Canceler();

            const res: D|null = await request(this.previousRequest);
            this.previousRequest = undefined;

            return res as D;
        } catch (e) {
            this.previousError = e;
            this.loading = false;

            if (showSnackbar) {
                this.$snackbar.snack(new SnackbarMessage(getRequestErrorMessage(this, e), 'error'));
            }
        }

        return null;
    }
}
