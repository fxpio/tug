/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import RepositoryManager from '../../composer/repositories/RepositoryManager';
import {validateForm} from '../../utils/validation';

/**
 * Enable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function enableRepository(req, res, next) {
    validateForm(req, {
        url: Joi.string().required(),
    });

    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    let url = req.body.url;
    let type = req.body.type;
    /** @type VcsRepository repo */
    let repo = await repoManager.register(url, type);

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
    validateForm(req, {
        url: Joi.string().required(),
    });

    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    let url = await repoManager.unregister(req.body.url);

    res.json({
        message: `The repository with the URL "${url}" were disabled successfully`,
        url: url
    });
}

/**
 * Refresh all packages of a repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function refreshPackages(req, res, next) {
    validateForm(req, {
        url: Joi.string().required(),
        version: Joi.string(),
        force: Joi.boolean()
    });

    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    let url = req.body.url;
    let version = req.body.version;
    let force = true === req.body.force;
    let message;

    if (version) {
        url = (await repoManager.refreshPackage(url, version, force)).getUrl();
        message = `Refreshing of package version "${version}" has started for the repository "${url}"`;
    } else {
        url = (await repoManager.refreshPackages(url, force)).getUrl();
        message = `Refreshing of all packages has started for the repository "${url}"`;
    }

    res.json({
        message: message,
        url: url
    });
}
