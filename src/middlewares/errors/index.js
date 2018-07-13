/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isProd} from '../../utils/server';
import HttpNotFoundError from "../../errors/HttpNotFoundError";
import HttpError from "../../errors/HttpError";
import ValidationError from "../../errors/ValidationError";
import HttpBadRequestError from "../../errors/HttpBadRequestError";

/**
 * Display the http not found error.
 *
 * @param {IncomingMessage} req The request
 * @param {ServerResponse}  res The response
 */
export function convertRouteNotFound(req, res) {
    throw new HttpNotFoundError();
}

/**
 * Display the http not found error for URI errors.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export function convertURIError(err, req, res, next) {
    if (err instanceof URIError) {
        throw new HttpNotFoundError();
    }
    next(err);
}

/**
 * Display the http bad request error for JSON Syntax errors.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export function convertJsonSyntaxError(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400) {
        throw new HttpBadRequestError('The body of your request is not a valid JSON');
    }
    next(err);
}

/**
 * Display the http error or the 500 error if it isn't a http error.
 *
 * @param {Error}           err  The error
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export function showError(err, req, res, next) {
    let data = {
        code: 500,
        message: 'Internal error'
    };

    if (err instanceof HttpError) {
        data.message = err.message;
        data.code = err.getStatusCode();

        if (err instanceof ValidationError) {
            data.errors = err.getFieldErrors();
        }
    } else if (!isProd()) {
        data.error = err.message
    }

    res.status(data.code).json(data);
}
