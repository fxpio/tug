/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import HttpError from '../../errors/HttpError';

/**
 * Display the list of all packages in the "provider" format.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export function logErrors(err, req, res, next) {
    if (!(err instanceof HttpError)) {
        req.app.set('logger').log('error', err);
    }

    next(err);
}
