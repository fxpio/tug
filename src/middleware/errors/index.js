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
export function showError500(err, req, res, next) {
    let data = {
        message: 'Internal error'
    };

    if (!isProd()) {
        data.error = err.message
    }

    res.status(500).json(data);
}
