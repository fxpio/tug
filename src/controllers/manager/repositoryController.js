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
