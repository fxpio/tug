/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosError, AxiosResponse} from 'axios';
import Vue from 'vue';

/**
 *  Get the error message of the request.
 *
 * @param {Error} err The request error
 *
 * @return {string|null}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function getRequestErrorMessage(err: Error): string|null {
    let message:string|null = null;

    if ((<AxiosError>err).response && (<AxiosResponse>(<AxiosError>err).response).status) {
        if ((<AxiosResponse>(<AxiosError>err).response)
                && (<AxiosResponse>(<AxiosError>err).response).data
                && (<AxiosResponse>(<AxiosError>err).response).data.message) {
            message = (<AxiosResponse>(<AxiosError>err).response).data.message;
        }
    } else {
        message = Vue.i18n.translate('error.network', {}) as string;
    }

    return message;
}
