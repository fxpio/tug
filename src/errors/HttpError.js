/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import FxpServerlessError from './FxpServerlessError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class HttpError extends FxpServerlessError
{
    /**
     * Constructor.
     *
     * @param {String} message
     * @param {Number} statusCode
     * @param {String} [fileName}
     * @param {Number} [lineNumber}
     */
    constructor(message, statusCode, fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.statusCode = statusCode;
    }

    /**
     * Get the http status code.
     *
     * @return {Number}
     */
    getStatusCode() {
        return this.statusCode;
    }
}
