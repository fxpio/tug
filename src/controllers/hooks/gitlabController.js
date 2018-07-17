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
    let body = req.body,
        message = 'Hello Gitlab!',
        version;

    if (body.repository && body.repository['git_http_url']) {
        let url = body.repository['git_http_url'];
        let repo = await repoManager.getRepository(url);

        if (repo) {
            if (body.ref.startWiths('refs/heads/')) {
                version = 'dev-' + body.ref.substring(11);

                if (body.created) {
                    message += await refreshVersion(queue, repo, version, body['checkout_sha']);
                } else if (body.deleted) {
                    message += await deleteVersion(queue, repo, version);
                } else if (!body.created && !body.deleted && body['checkout_sha'] && body['commits'].length > 0) {
                    message += await refreshVersion(queue, repo, version, body['checkout_sha'], true);
                }
            } else if (body.ref.startWiths('refs/tags/')) {
                version = body.ref.substring(10);

                if (body.created) {
                    message += await refreshVersion(queue, repo, version, body['checkout_sha']);
                } else if (body.deleted) {
                    message += await deleteVersion(queue, repo, version);
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
 * @param {VcsRepository} repo       The vcs repository
 * @param {String}        version    The version
 * @param {String}        identifier The identifier
 * @param {Boolean}       force      Refresh the package even if it exists
 *
 * @return {Promise<String>}
 */
async function refreshVersion(queue, repo, version, identifier, force = false) {
    await queue.send({
        type: 'refresh-package',
        repositoryUrl: repo.getUrl(),
        identifier: identifier,
        version: version,
        force: force
    });

    return ` Refreshing of package version "${version}" has started for the repository "${repo.getUrl()}"`;
}

/**
 * Delete the version.
 *
 * @param {MessageQueue}  queue   The message queue
 * @param {VcsRepository} repo    The vcs repository
 * @param {String}        version The version
 *
 * @return {Promise<String>}
 */
async function deleteVersion(queue, repo, version) {
    if (repo.isInitialized()) {
        await queue.send({
            type: 'delete-package',
            packageName: repo.getPackageName(),
            version: version
        });

        return ` Deleting of package version "${version}" has started for the repository "${repo.getUrl()}"`;
    }

    return ` Deleting of package version "${version}" has skipped for the repository "${repo.getUrl()}" because the repository is not initialized`;
}
