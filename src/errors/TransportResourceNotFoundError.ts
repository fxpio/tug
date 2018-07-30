/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {TransportError} from '@app/errors/TransportError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class TransportResourceNotFoundError extends TransportError
{
    public readonly resourceUrl: string;

    /**
     * Constructor.
     *
     * @param {string} resourceUrl
     * @param {number} statusCode
     */
    constructor(resourceUrl: string, statusCode?: number) {
        super(`The "${resourceUrl}" resource could not be downloaded`, statusCode);
        this.resourceUrl = resourceUrl;
    }
}
