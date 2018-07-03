/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isProd} from '../../utils/server';

/**
 * Display the list of all packages in the "provider" format.
 *
 * @param {Object}   err  The error
 * @param {Object}   req  The Express Request object
 * @param {Object}   res  The Express Response object
 * @param {function} next The next callback
 */
export function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
