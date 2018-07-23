/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import HttpBadRequestError from './HttpBadRequestError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class ValidationError extends HttpBadRequestError
{
    private readonly errorFields: Object;

    /**
     * Constructor.
     *
     * @param {Object} errorFields
     * @param {string} [message]
     */
    constructor(errorFields: Object, message: string = 'Validation errors') {
        super(message);
        this.errorFields = errorFields;
    }

    /**
     * Get the error fields.
     *
     * @return {Object}
     */
    public getFieldErrors(): Object {
        return this.errorFields;
    }
}
