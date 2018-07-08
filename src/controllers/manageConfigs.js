/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {generateToken} from '../utils/token';

/**
 * Create the api key.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createApiKey(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let token = req.body.token ? req.body.token : generateToken(40);

    await storage.put('api-keys/' + token);

    res.json({
        message: `The API key "${token}" was created successfully`,
        token: token
    });
    next();
}

/**
 * Delete the api key.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteApiKey(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let token = req.body.token;

    if (!token) {
        res.status(400).json({
            message: 'The "token" body attribute is required'
        });
        return;
    }

    await storage.delete('api-keys/' + token);

    res.json({
        message: `The API key "${token}" was deleted successfully`,
        token: token
    });
    next();
}

/**
 * Create the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createGithubToken(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let token = req.body.token ? req.body.token : generateToken(40);

    await storage.put('github-token', token);

    res.json({
        message: `The token "${token}" for Github Webhooks was created successfully`,
        token: token
    });
    next();
}

/**
 * Delete the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteGithubToken(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');

    await storage.delete('github-token');

    res.json({
        message: `The token for Github Webhooks was deleted successfully`
    });
    next();
}

/**
 * Show the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGithubToken(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');

    let token = await storage.get('github-token');
    let message = token ? `The token for Github Webhooks is "${token}"` : `The token for Github Webhooks is not generated`;

    res.json({
        message: message,
        token: token
    });
    next();
}

/**
 * Enable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function enableRepository(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let repository = req.body.repository;

    let err = validateRepository(repository);
    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    await storage.put('repositories/' + repository);

    res.json({
        message: `The repository "${repository}" were enabled successfully`,
        repository: repository
    });
    next();
}

/**
 * Disable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function disableRepository(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let repository = req.body.repository;

    let err = validateRepository(repository);
    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    await storage.delete('repositories/' + repository);

    res.json({
        message: `The repository "${repository}" were disabled successfully`,
        repository: repository
    });
    next();
}

/**
 * Validate the repository.
 *
 * @param {string} repository
 *
 * @return {Error|null}
 */
function validateRepository(repository) {
    let err = null;

    if (!repository) {
        err = new Error('The "repository" body attribute is required');
    } else if (!repository.match(/\//)) {
        err = new Error('The repository name must be formated with "<username-or-organization-name>/<repository-name>"');
    }

    return err;
}
