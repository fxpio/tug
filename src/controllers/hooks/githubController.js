/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import RepositoryManager from '../../composer/repositories/RepositoryManager';
import {getGithubEvent} from '../../utils/apiGithub';

/**
 * Hook for Github Webhooks.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function githubHook(req, res, next) {
    switch(getGithubEvent(req)) {
        case 'ping':
            await enableRepository(req, res);
            break;
        default:
            next();
            break;
    }
}

/**
 * Enable the repository.
 *
 * @param {IncomingMessage} req The request
 * @param {ServerResponse}  res The response
 *
 * @return {Promise<void>}
 */
async function enableRepository(req, res) {
    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    let body = req.body,
        message = 'Hello Github!';

    if (body.hook && 'Repository' === body.hook.type && body.repository && body.repository['clone_url']) {
        await repoManager.register(body.repository['clone_url'], 'vcs-github');
        message += ' The scan of the Composer packages has started';
    }

    res.json({
        message: message
    });
}
