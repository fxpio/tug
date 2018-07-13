/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import RepositoryManager from '../../composer/repositories/RepositoryManager';
import RepositoryError from '../../composer/repositories/RepositoryError'

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
    /** @type VcsRepository repo */
    let repo;

    try {
        repo = await repoManager.register(url, type);
    } catch (e) {
        if (e instanceof RepositoryError) {
            err = e;
        } else {
            throw e;
        }
    }

    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    res.json({
        message: `The "${repo.getType()}" repository with the URL "${repo.getUrl()}" were enabled successfully`,
        url: repo.getUrl(),
        type: repo.getType()
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
        url = await repoManager.unregister(url);
    } catch (e) {
        if (e instanceof RepositoryError) {
            err = e;
        } else {
            throw e;
        }
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
