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
 * Display the list of all packages in the "provider" format.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function githubHook(req, res, next) {
    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    /** @type {MessageQueue} */
    let queue = req.app.set('queue');
    let body = req.body,
        type = getGithubEvent(req),
        message = 'Hello Github!';

    if ('ping' === type) {
        if (body.hook && 'Repository' === body.hook.type && body.repository && body.repository['clone_url']) {
            // enable the repository
            let data = await repoManager.register(body.repository['clone_url'], 'vcs-github');
            // send refresh all packages in queue
            await queue.send({
                type: 'refresh-packages',
                repository: data.id
            });

            message += ' The scan of the Composer packages has started';
        }

        res.json({
            message: message
        });
    } else {
        next();
    }
}
