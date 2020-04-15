/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpError} from '@server/errors/HttpError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class HttpNotFoundError extends HttpError {
    /**
     * Constructor.
     *
     * @param {string} [message]
     */
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}
