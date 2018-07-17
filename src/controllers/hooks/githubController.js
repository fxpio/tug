/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logger from 'winston/lib/winston/logger';
import RepositoryManager from '../../composer/repositories/RepositoryManager';
import VcsRepository from '../../composer/repositories/VcsRepository';
import MessageQueue from '../../queues/MessageQueue';
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
        log(req.app.set('logger'), `Registration of the repository "${body.repository['clone_url']}"`);
        await repoManager.register(body.repository['clone_url'], 'vcs-github');
        message += ' The scan of the Composer packages has started';
    }

    res.json({
        message: message
    });
}

/**
 * Push action.
 *
 * @param {IncomingMessage} req The request
 * @param {ServerResponse}  res The response
 *
 * @return {Promise<void>}
 */
async function pushAction(req, res) {
    /** @type {RepositoryManager} repoManager */
    let repoManager = req.app.set('repository-manager');
    /** @typedef {MessageQueue} queue */
    let queue = req.app.set('queue');
    /** @typedef {Logger} logger */
    let logger = req.app.set('logger');
    let body = req.body,
        message = 'Hello Github!',
        version;

    if (body.repository && body.repository['git_url']) {
        let url = body.repository['git_url'];
        let repo = await repoManager.getRepository(url);

        if (repo) {
            if (body.ref.startsWith('refs/heads/')) {
                version = 'dev-' + body.ref.substring(11);

                if (body.created) {
                    message += await refreshVersion(queue, logger, repo, version, body['head_commit']['id']);
                } else if (body.deleted) {
                    message += await deleteVersion(queue, logger, repo, version);
                } else if (!body.created && !body.deleted && body['head_commit'] && body['commits'].length > 0) {
                    message += await refreshVersion(queue, logger, repo, version, body['head_commit']['id'], true);
                }
            } else if (body.ref.startsWith('refs/tags/')) {
                version = body.ref.substring(10);

                if (body.created) {
                    message += await refreshVersion(queue, logger, repo, version, body['head_commit']['id']);
                } else if (body.deleted) {
                    message += await deleteVersion(queue, logger, repo, version);
                }
            }
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
 * @param {String}        version    The version
 * @param {String}        identifier The identifier
 * @param {Boolean}       force      Refresh the package even if it exists
 *
 * @return {Promise<String>}
 */
async function refreshVersion(queue, logger, repo, version, identifier, force = false) {
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
 * @param {String}        version The version
 *
 * @return {Promise<String>}
 */
async function deleteVersion(queue, logger, repo, version) {
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
 * @param {String} message The message
 *
 * @return {String}
 */
function log(logger, message) {
    logger.log('info', '[Github Webhook] ' + message);

    return message;
}
