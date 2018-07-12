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
 * Display the 404 error.
 *
 * @param {IncomingMessage} req The request
 * @param {ServerResponse}  res The response
 */
export function showError404(req, res) {
    res.status(404).json({
        message: 'Not found'
    });
}

/**
 * Display the 404 error for URI errors.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export function showUriError404(err, req, res, next) {
    if (err instanceof URIError) {
        showError404(req, res);
        return;
    }

    next(err);
}

/**
 * Display the 400 error for json errors.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export function showJsonError400(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: 'The body of your request is not a valid JSON'
        });
    }

    next(err);
}

/**
 * Display the 500 error.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
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
