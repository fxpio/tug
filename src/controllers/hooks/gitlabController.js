/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import RepositoryManager from '../../composer/repositories/RepositoryManager';
import {getGitlabEvent} from '../../utils/apiGitlab';

/**
 * Hook for Gitlab Webhooks.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function gitlabHook(req, res, next) {
    switch(getGitlabEvent(req)) {
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
        message = 'Hello Gitlab!';

    if (body.repository && body.repository['git_http_url']) {
        await repoManager.register(body.repository['git_http_url'], 'vcs-gitlab');
        message += ' The scan of the Composer packages has started';
    }

    res.json({
        message: message
    });
}
