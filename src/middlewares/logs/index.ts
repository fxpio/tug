/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpError} from '@app/errors/HttpError';
import {Logger} from '@app/loggers/Logger';
import {Request, Response} from 'express';

/**
 * Display the list of all packages in the "provider" format.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function logErrors(err: Error, req: Request, res: Response, next: Function): void {
    if (!(err instanceof HttpError)) {
        (req.app.get('logger') as Logger).log('error', err);
    }

    next(err);
}
