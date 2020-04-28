/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {ApiRequestError} from '@app/api/errors/ApiRequestError';
import {Canceler} from '@app/api/Canceler';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class BaseAjaxContent extends Vue {
    public loading: boolean = false;

    public previousError: ApiRequestError | null = null;

    public previousRequest?: Canceler;

    public beforeDestroy(): void {
        this.previousError = null;

        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }

    public fieldErrors(field: string): string[] {
        return this.previousError && this.previousError.errors[field] ? this.previousError.errors[field] : [];
    }
}
