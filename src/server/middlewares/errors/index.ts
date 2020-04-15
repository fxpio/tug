/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpBadRequestError} from '@server/errors/HttpBadRequestError';
import {HttpError} from '@server/errors/HttpError';
import {HttpNotFoundError} from '@server/errors/HttpNotFoundError';
import {HttpTooManyRequestsError} from '@server/errors/HttpTooManyRequestsError';
import {HttpUnauthorizedError} from '@server/errors/HttpUnauthorizedError';
import {HttpValidationError} from '@server/errors/HttpValidationError';
import {RepositoryNotFoundError} from '@server/errors/RepositoryNotFoundError';
import {RepositoryNotSupportedError} from '@server/errors/RepositoryNotSupportedError';
import {VcsDriverBranchNotFoundError} from '@server/errors/VcsDriverBranchNotFoundError';
import {VcsDriverTagNotFoundError} from '@server/errors/VcsDriverTagNotFoundError';
import {Translator} from '@server/translators/Translator';
import {LooseObject} from '@server/utils/LooseObject';
import {Request, Response} from 'express';

/**
 * Display the http not found error.
 *
 * @param {Request}  req The request
 * @param {Response} res The response
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertRouteNotFoundError(req: Request, res: Response): void {
    throw new HttpNotFoundError();
}

/**
 * Display the http too many requests error.
 *
 * @param {Error}    err  The error
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function convertProvisionedThroughputExceededError(err: Error, req: Request, res: Response, next: Function): void {
    if ('ProvisionedThroughputExceededException' === err.name) {
        throw new HttpTooManyRequestsError();
    }
    next(err);
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
        let translator = req.app.get('translator') as Translator;
        throw new HttpBadRequestError(translator.trans(res, 'error.http.bad-request.invalid-json'));
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
    let translator = req.app.get('translator') as Translator;

    if (err instanceof VcsDriverBranchNotFoundError) {
        throw new HttpNotFoundError(translator.trans(res, 'error.http.not-found.repository-branch', {name: err.name}));
    } else if (err instanceof VcsDriverTagNotFoundError) {
        throw new HttpNotFoundError(translator.trans(res, 'error.http.not-found.repository-tag', {name: err.name}));
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
    let translator = req.app.get('translator') as Translator;

    if (err instanceof RepositoryNotFoundError) {
        throw new HttpNotFoundError(translator.trans(res, 'error.http.not-found.repository', {url: err.url}));
    } else if (err instanceof RepositoryNotSupportedError) {
        throw new HttpBadRequestError(translator.trans(res, 'error.http.not-supported.repository', {url: err.url}));
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
    let translator = req.app.get('translator') as Translator;
    let data: LooseObject = {
        code: 500,
        message: translator.trans(res, 'error.http.internal-server')
    };

    if (err instanceof HttpError) {
        data.message = err.message;
        data.code = err.statusCode;

        if (err instanceof HttpValidationError && err.message === 'Validation Errors') {
            data.message = translator.trans(res, 'error.http.bad-request.validation');
        } else if (err instanceof HttpUnauthorizedError && err.message === 'Your credentials are invalid') {
            data.message = translator.trans(res, 'error.http.unauthorized.basic');
        } else if (err instanceof HttpBadRequestError && err.message === 'Bad Request') {
            data.message = translator.trans(res, 'error.http.bad-request');
        } else if (err instanceof HttpNotFoundError && err.message === 'Not Found') {
            data.message = translator.trans(res, 'error.http.not-found');
        } else if (err instanceof HttpTooManyRequestsError && err.message === 'Too Many Requests') {
            data.message = translator.trans(res, 'error.http.too-many-requests');
        }

        if (err instanceof HttpValidationError) {
            data.errors = err.fieldErrors;
        }
    } else if (req.app.get('debug')) {
        data.error = err.message
    }

    res.status(data.code).json(data);
}
