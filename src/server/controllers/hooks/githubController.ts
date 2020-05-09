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
import {getGithubEvent} from '@server/utils/apiGithub';
import {Request, Response} from 'express';

/**
 * Hook for Github Webhooks.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function githubHook(req: Request, res: Response, next: Function): Promise<void> {
    switch (getGithubEvent(req)) {
        case 'ping':
            await enableRepository(req, res);
            break;
        case 'push':
            await pushAction(req, res);
            break;
        default:
            next();
            break;
    }
}

/**
 * Enable the repository.
 *
 * @param {Request}  req The request
 * @param {Response} res The response
 *
 * @return {Promise<void>}
 */
async function enableRepository(req: Request, res: Response): Promise<void> {
    const repoManager: RepositoryManager = req.app.get('repository-manager');
    const body = req.body;
    let message = 'Hello Github!';

    if (body.hook && 'Repository' === body.hook.type && body.repository && body.repository.clone_url) {
        log(req.app.get('logger'), `Registration of the repository "${body.repository.clone_url}"`);
        await repoManager.register(body.repository.clone_url, 'vcs-github', res);
        message += ' The scan of the Composer packages has started';
    }

    res.json({
        message,
    });
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
    let message = 'Hello Github!';
    let version;

    if (body.repository && body.repository.git_url) {
        const url = body.repository.git_url;
        const repo = await repoManager.getRepository(url, false, res);

        if (repo) {
            if (body.ref.startsWith('refs/heads/')) {
                version = 'dev-' + body.ref.substring(11);

                if (body.created) {
                    message += await refreshVersion(queue, logger, repo, version, body.head_commit.id);
                } else if (body.deleted) {
                    message += await deleteVersion(queue, logger, repo, version);
                } else if (!body.created && !body.deleted && body.head_commit && body.commits.length > 0) {
                    message += await refreshVersion(queue, logger, repo, version, body.head_commit.id, true);
                }
            } else if (body.ref.startsWith('refs/tags/')) {
                version = body.ref.substring(10);

                if (body.created) {
                    message += await refreshVersion(queue, logger, repo, version, body.head_commit.id);
                } else if (body.deleted) {
                    message += await deleteVersion(queue, logger, repo, version);
                }
            }
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
    logger.log('info', '[Github Webhook] ' + message);

    return message;
}
