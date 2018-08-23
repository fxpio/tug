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
import {Request, Response} from 'express';
import VcsRepository from '../../composer/repositories/VcsRepository';
import MessageQueue from '../../queues/MessageQueue';
import Logger from '../../loggers/Logger';

/**
 * Hook for Github Webhooks.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function gitlabHook(req: Request, res: Response, next: Function): Promise<void> {
    let event: string|null = getGitlabEvent(req);

    if(typeof event === null) {
      next();
    }

    event = event as string;

    switch(event.toLowerCase()) {
        case 'push hook':
        case 'tag push hook':
            await pushAction(req, res);
            break;
        default:
            next();
            break;
    }
}

/**
 * Push action.
 *
 * @param {IncomingMessage} req The request
 * @param {ServerResponse}  res The response
 *
 * @return {Promise<void>}
 */
async function pushAction(req: Request, res: Response): Promise<void> {

    let repoManager: RepositoryManager = req.app.get('repository-manager');
    let queue: MessageQueue = req.app.get('queue');
    let logger: Logger = req.app.get('logger');
    let body = req.body,
        message = 'Hello Gitlab!',
        version;

    if (body.repository && body.repository['git_http_url']) {
        let url = body.repository['git_http_url'];
        let repo = await repoManager.getRepository(url);

        if (repo) {
            if (body.ref.startsWith('refs/heads/')) {
                version = 'dev-' + body.ref.substring(11);

                if (body.checkout_sha !== null) {
                    message += await refreshVersion(queue, logger, repo, version, body['checkout_sha']);
                } else if (body.checkout_sha === null) {
                    message += await deleteVersion(queue, logger, repo, version);
                } else {
                    message += "Invalid event";
                }
            } else if (body.ref.startsWith('refs/tags/')) {
                version = body.ref.substring(10);

                if (body.checkout_sha !== null) {
                    message += await refreshVersion(queue, logger, repo, version, body['checkout_sha']);
                } else if (body.checkout_sha === null) {
                    message += await deleteVersion(queue, logger, repo, version);
                } else {
                    message += "Invalid event";
                }
            }
        } else if(body.repository && body.repository['git_http_url']) {

            await repoManager.register(body.repository['git_http_url'], 'vcs-gitlab');
            message += ' The scan of the Composer packages has started';
        }
    }

    res.json({
        message: message
    });
}

/**
 * Refresh the version.
 *
 * @param {MessageQueue}  queue      The message queue
 * @param {Logger}        logger     The logger
 * @param {VcsRepository} repo       The vcs repository
 * @param {string}        version    The version
 * @param {string}        identifier The identifier
 * @param {boolean}       force      Refresh the package even if it exists
 *
 * @return {Promise<string>}
 */
async function refreshVersion(queue: MessageQueue, logger: Logger, repo: VcsRepository, version: string, identifier: string, force: boolean = false): Promise<string> {
    let mess = log(logger, `Refreshing of package version "${version}" has started for the repository "${repo.getUrl()}"`);
    await queue.send({
        type: 'refresh-package',
        repositoryUrl: repo.getUrl(),
        identifier: identifier,
        version: version,
        force: force
    });

    return ` ${mess}`;
}

/**
 * Delete the version.
 *
 * @param {MessageQueue}  queue   The message queue
 * @param {Logger}        logger  The logger
 * @param {VcsRepository} repo    The vcs repository
 * @param {string}        version The version
 *
 * @return {Promise<string>}
 */
async function deleteVersion(queue: MessageQueue, logger: Logger, repo: VcsRepository, version: string): Promise<string> {
    let mess = '';
    if (repo.isInitialized()) {
        mess = log(logger, `Deleting of package version "${version}" has started for the repository "${repo.getUrl()}"`);
        await queue.send({
            type: 'delete-package',
            packageName: repo.getPackageName(),
            version: version
        });
    } else {
      mess = log(logger, `Deleting of package version "${version}" has skipped for the repository "${repo.getUrl()}" because the repository is not initialized`);
    }

    return ` ${mess}`;
}

/**
 * Log the message info.
 *
 * @param {Logger} logger  The logger
 * @param {string} message The message
 *
 * @return {string}
 */
function log(logger: Logger, message: string): string {
    logger.log('info', '[Gitlab Webhook] ' + message);

    return message;
}
