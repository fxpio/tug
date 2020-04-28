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
    if (err instanceof ApiRequestError) {
        return 'Error network' === err.message && vue.$i18n
            ? vue.$i18n.t('error.network') as string
            : err.message;
    }

    console.error(err);

    return vue.$i18n ? vue.$i18n.t('error.internal') as string : 'Internal error';
}
