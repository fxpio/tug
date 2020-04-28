/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ApiError} from './ApiError';
import {MapObject} from '../models/MapObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ApiRequestError extends ApiError {
    public readonly statusCode: number;

    public readonly errors: MapObject<string[]>;

    public readonly previousError: Error;

    constructor(message: string, statusCode: number, errors: MapObject<string[]>, previousError: Error) {
        super(message);

        this.statusCode = statusCode;
        this.errors = errors;
        this.previousError = previousError;
    }
}
