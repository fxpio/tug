/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosError, AxiosResponse} from 'axios';
import {ApiRequestError} from '../errors/ApiRequestError';
import {MapObject} from '../models/MapObject';

/**
 * Create the error for the api.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createApiError(error: Error): ApiRequestError {
    let message: string = 'Error network';
    let statusCode: number = 0;
    const errors = getRequestErrors(error);

    if ((error as AxiosError).response && ((error as AxiosError).response as AxiosResponse).status) {
        statusCode = ((error as AxiosError).response as AxiosResponse).status;

        if (((error as AxiosError).response as AxiosResponse).data) {
            message = ((error as AxiosError).response as AxiosResponse).data.message ?? message;
        }
    }

    return new ApiRequestError(message, statusCode, errors, error);
}

/**
 * Get the content errors.
 *
 * @param {Error} err The error
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function getRequestErrors(err: Error): MapObject<string[]> {
    const errors: MapObject<string[]> = {};

    if ((err as AxiosError).response && ((err as AxiosError).response as AxiosResponse).status) {
        if (((err as AxiosError).response as AxiosResponse)
                && ((err as AxiosError).response as AxiosResponse).data
                && typeof ((err as AxiosError).response as AxiosResponse).data.errors === 'object') {
            const valErrors: any = ((err as AxiosError).response as AxiosResponse).data.errors as object;

            for (const field of Object.keys(valErrors)) {
                const fieldErrors = [];
                const fieldErrVal: any = valErrors[field];

                if (Array.isArray(fieldErrVal)) {
                    for (const subFieldErrVal of fieldErrVal) {
                        if (typeof subFieldErrVal as any === 'string') {
                            fieldErrors.push(subFieldErrVal);
                        }
                    }
                } else if (typeof fieldErrVal === 'string') {
                    fieldErrors.push(fieldErrVal);
                }

                errors[field] = fieldErrors;
            }
        }
    }

    return errors;
}
