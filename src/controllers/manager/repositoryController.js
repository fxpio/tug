/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import RepositoryManager from '../../composer/repositories/RepositoryManager';

/**
 * Enable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function enableRepository(req, res, next) {
    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    let url = req.body.url;
    let type = req.body.type;
    let err = validateRepository(url);
    let repo;

    try {
        repo = await repoManager.register(url, type);
    } catch (e) {
        err = e;
    }

    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    res.json({
        message: `The "${repo.type}" repository with the URL "${repo.url}" were enabled successfully`,
        url: repo.url,
        type: repo.type
    });
}

/**
 * Disable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function disableRepository(req, res, next) {
    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    let url = req.body.url;
    let err = validateRepository(url);

    try {
        await repoManager.unregister(url);
    } catch (e) {
        err = e;
    }

    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    res.json({
        message: `The repository with the URL "${url}" were disabled successfully`,
        url: url
    });
}

/**
 * Validate the repository URL.
 *
 * @param {string} url
 *
 * @return {Error|null}
 */
function validateRepository(url) {
    let err = null;

    if (!url) {
        err = new Error('The "url" body attribute is required');
    }

    return err;
}
