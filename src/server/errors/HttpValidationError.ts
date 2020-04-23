/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpBadRequestError} from '@server/errors/HttpBadRequestError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class HttpValidationError extends HttpBadRequestError {
    public readonly fieldErrors: Object;

    /**
     * Constructor.
     *
     * @param {Object} fieldErrors
     * @param {string} [message]
     */
    constructor(fieldErrors: Object, message: string = 'Validation Errors') {
        super(message);
        this.fieldErrors = fieldErrors;
    }
}
