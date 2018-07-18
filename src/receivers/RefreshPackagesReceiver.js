/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logger from '../loggers/Logger';
import MessageQueue from '../queues/MessageQueue';
import QueueReceiver from '../queues/QueueReceiver';
import RepositoryManager from '../composer/repositories/RepositoryManager';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RefreshPackagesReceiver extends QueueReceiver
{
    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager The repository manager
     * @param {MessageQueue}      queue       The message queue
     * @param {Logger}            logger      The logger
     */
    constructor(repoManager, queue, logger) {
        super();
        this.repoManager = repoManager;
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    supports(message) {
        return message && 'refresh-packages' === message.type;
    }

    /**
     * @inheritDoc
     */
    async execute(message) {
        let force = true === message.force;
        let repo = await this.repoManager.getAndInitRepository(message.repositoryUrl, force);
        if (!repo) {
            this.logger.log('verbose', `[Refresh Packages Receiver] Repository is not found for "${message.repositoryUrl}"`);
            return;
        }

        let driver = repo.getDriver();
        let branches = await driver.getBranches();
        let tags = await driver.getTags();
        let newMessages = [];

        for (let name of Object.keys(branches)) {
            newMessages.push(createMessage(message.repositoryUrl, branches[name], 'dev-' + name, force));
        }

        for (let name of Object.keys(tags)) {
            newMessages.push(createMessage(message.repositoryUrl, tags[name], name, force));
        }

        await this.queue.sendBatch(newMessages);
    }
}

/**
 * Create the refresh package message.
 *
 * @param {String}  repositoryUrl The repository url
 * @param {String}  identifier    The identifier
 * @param {String}  version       The version
 * @param {Boolean} force         Check if existing packages must be overridden
 *
 * @return {{type: String, repositoryUrl: String, identifier: String, version: String, force: Boolean}}
 */
function createMessage(repositoryUrl, identifier, version, force) {
    return {
        type: 'refresh-package',
        repositoryUrl: repositoryUrl,
        identifier: identifier,
        version: version,
        force: force
    };
}
