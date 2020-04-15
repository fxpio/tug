/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FxpServerlessError} from '@server/errors/FxpServerlessError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class TransportError extends FxpServerlessError
{
    public readonly statusCode?: number;

    /**
     * Constructor.
     *
     * @param {string} message      The error message
     * @param {number} [statusCode] The http status code
     */
    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
    }
}
