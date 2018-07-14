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
    /**
     * Constructor.
     *
     * @param {Object} errorFields
     * @param {String} [message]
     * @param {String} [fileName}
     * @param {Number} [lineNumber}
     */
    constructor(errorFields, message = 'Validation errors', fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.errorFields = errorFields;
    }

    /**
     * Get the error fields.
     *
     * @return {Object<String, String|Array<String>>}
     */
    getFieldErrors() {
        return this.errorFields;
    }
}
