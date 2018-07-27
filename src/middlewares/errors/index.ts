/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpNotFoundError} from '../../errors/HttpNotFoundError';
import {HttpError} from '../../errors/HttpError';
import {HttpValidationError} from '../../errors/HttpValidationError';
import {HttpBadRequestError} from '../../errors/HttpBadRequestError';
import {VcsDriverTagNotFoundError} from '../../errors/VcsDriverTagNotFoundError';
import {VcsDriverBranchNotFoundError} from '../../errors/VcsDriverBranchNotFoundError';
import {RepositoryNotFoundError} from '../../errors/RepositoryNotFoundError';
import {RepositoryNotSupportedError} from '../../errors/RepositoryNotSupportedError';
import {Request, Response} from 'express';
import {LooseObject} from '../../utils/LooseObject';
import {isProd} from '../../utils/server';

/**
 * Display the http not found error.
 *
 * @param {Request}  req The request
 * @param {Response} res The response
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertRouteNotFound(req: Request, res: Response): void {
    throw new HttpNotFoundError();
}

/**
 * Display the http not found error for URI errors.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertURIError(err: Error, req: Request, res: Response, next: Function): void {
    if (err instanceof URIError) {
        throw new HttpNotFoundError();
    }
    next(err);
}

/**
 * Display the http bad request error for JSON Syntax errors.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertJsonSyntaxError(err: Error, req: Request, res: Response, next: Function): void {
    if (err instanceof SyntaxError && (err as LooseObject).status === 400) {
        throw new HttpBadRequestError('The body of your request is not a valid JSON');
    }
    next(err);
}

/**
 * Display the vcs driver errors.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertVcsDriverError(err: Error, req: Request, res: Response, next: Function): void {
    if (err instanceof VcsDriverBranchNotFoundError) {
        throw new HttpNotFoundError(`Branch "${err.name}" is not found`);
    } else if (err instanceof VcsDriverTagNotFoundError) {
        throw new HttpNotFoundError(`Tag "${err.name}" is not found`);
    }

    next(err);
}

/**
 * Display the repository errors.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertRepositoryError(err: Error, req: Request, res: Response, next: Function): void {
    if (err instanceof RepositoryNotFoundError) {
        throw new HttpNotFoundError(`The repository with the url "${err.url}" is not found`);
    } else if (err instanceof RepositoryNotSupportedError) {
        throw new HttpBadRequestError(`The repository with the URL "${err.url}" is not supported`);
    }

    next(err);
}

/**
 * Display the http error or the 500 error if it isn't a http error.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function showError(err: Error, req: Request, res: Response, next: Function): void {
    let data: LooseObject = {
        code: 500,
        message: 'Internal error'
    };

    if (err instanceof HttpError) {
        data.message = err.message;
        data.code = err.statusCode;

        if (err instanceof HttpValidationError) {
            data.errors = err.fieldErrors;
        }
    } else if (!isProd()) {
        data.error = err.message
    }

    res.status(data.code).json(data);
}
