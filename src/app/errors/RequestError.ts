/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AppError} from './AppError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RequestError extends AppError {
    public readonly error: Error;

    /**
     * Constructor.
     */
    constructor(error: Error, message?: string) {
        super(message);
        this.error = error;
    }
}
