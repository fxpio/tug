/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {getGithubEvent} from '../../utils/apiGithub';

/**
 * Display the list of all packages in the "provider" format.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function githubHook(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    /** @type {MessageQueue} */
    let queue = req.app.set('queue');
    let body = req.body,
        type = getGithubEvent(req),
        message = 'Hello Github!';

    if ('ping' === type) {
        if (body.hook && 'Repository' === body.hook.type && body.repository && body.repository['full_name']) {
            // enable the repository
            await storage.put('repositories/' + body.repository['full_name'] + '/');
            // send refresh all packages in queue
            await queue.send({
                type: 'refresh-packages',
                repository: body.repository['full_name']
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
