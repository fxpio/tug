/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ApiServiceConstructor} from '@app/api/ApiService';
import {ApiError} from './ApiError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ApiServiceNotFoundError extends ApiError {
    constructor(service: ApiServiceConstructor|string) {
        super(`The api service "${service}" is not found`);
    }
}
