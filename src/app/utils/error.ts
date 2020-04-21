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
 * @param {Vue}   vue The vue instance
 * @param {Error} err The request error
 *
 * @return {string}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function getRequestErrorMessage(vue: Vue, err: Error): string {
    if ((err as AxiosError).response && ((err as AxiosError).response as AxiosResponse).status) {
        if (((err as AxiosError).response as AxiosResponse)
                && ((err as AxiosError).response as AxiosResponse).data
                && ((err as AxiosError).response as AxiosResponse).data.message) {
            return ((err as AxiosError).response as AxiosResponse).data.message;
        }

        return vue.$i18n ? vue.$i18n.t('error.network') as string : 'Error network';
    }

    console.error(err);

    return vue.$i18n ? vue.$i18n.t('error.internal') as string : 'Internal error';
}
