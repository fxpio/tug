/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FxpServerlessError} from './FxpServerlessError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class TransportError extends FxpServerlessError
{
    private readonly statusCode?: number;

    /**
     * Constructor.
     *
     * @param {string} message
     * @param {number} statusCode
     */
    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
    }

    /**
     * Get the http status code.
     *
     * @return {number|undefined}
     */
    public getStatusCode(): number|undefined {
        return this.statusCode;
    }
}
