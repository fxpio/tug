/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {VcsRepository} from '@server/composer/repositories/VcsRepository';
import {Logger} from '@server/loggers/Logger';
import {MessageQueue} from '@server/queues/MessageQueue';
import {getGitlabEvent} from '@server/utils/apiGitlab';
import {Request, Response} from 'express';

/**
 * Hook for Gitlab Webhooks.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function gitlabHook(req: Request, res: Response, next: Function): Promise<void> {
    let event: string|null = getGitlabEvent(req);

    if (typeof event === null) {
        next();
    }

    event = event as string;

    switch (event.toLowerCase()) {
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
 * @param {Request}  req The request
 * @param {Response} res The response
 *
 * @return {Promise<void>}
 */
async function pushAction(req: Request, res: Response): Promise<void> {
    const repoManager: RepositoryManager = req.app.get('repository-manager');
    const queue: MessageQueue = req.app.get('queue');
    const logger: Logger = req.app.get('logger');
    const body = req.body;
    let message = 'Hello Gitlab!';
    let version;

    if (body.repository && body.repository.git_http_url) {
        const url = body.repository.git_http_url;
        const repo = await repoManager.getRepository(url, false, res);

        if (repo) {
            if (body.ref.startsWith('refs/heads/')) {
                version = 'dev-' + body.ref.substring(11);

                if (body.checkout_sha) {
                    const created = '0000000000000000000000000000000000000000' === body.before;
                    message += await refreshVersion(queue, logger, repo, version, body.checkout_sha, !created);
                } else if (null === body.checkout_sha) {
                    message += await deleteVersion(queue, logger, repo, version);
                } else {
                    message += 'Invalid event';
                }
            } else if (body.ref.startsWith('refs/tags/')) {
                version = body.ref.substring(10);

                if (body.checkout_sha) {
                    message += await refreshVersion(queue, logger, repo, version, body.checkout_sha);
                } else if (null === body.checkout_sha) {
                    message += await deleteVersion(queue, logger, repo, version);
                } else {
                    message += 'Invalid event';
                }
            }
        } else if (body.repository && body.repository.git_http_url) {
            await repoManager.register(body.repository.git_http_url, 'vcs-gitlab');
            message += ' The scan of the Composer packages has started';
        }
    }

    res.json({
        message,
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
    const mess = log(logger, `Refreshing of package version "${version}" has started for the repository "${repo.getUrl()}" with the identifier "${identifier}"` + (force ? ' (forced)' : ''));
    await queue.send({
        type: 'refresh-package',
        repositoryUrl: repo.getUrl(),
        identifier,
        version,
        force,
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
    let mess;

    if (repo.isInitialized()) {
        mess = log(logger, `Deleting of package version "${version}" has started for the repository "${repo.getUrl()}"`);
        await queue.send({
            type: 'delete-package',
            packageName: repo.getPackageName(),
            version,
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
