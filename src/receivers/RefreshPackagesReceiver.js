/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
     */
    constructor(repoManager, queue) {
        super();
        this.repoManager = repoManager;
        this.queue = queue;
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
            return;
        }

        let driver = repo.getDriver();
        let branches = await driver.getBranches();
        let tags = await driver.getTags();
        let newMessages = [];

        for (let name of Object.keys(branches)) {
            newMessages.push({
                type: 'refresh-package',
                repositoryUrl: message.repositoryUrl,
                identifier: branches[name],
                branch: name,
                force: force
            });
        }

        for (let name of Object.keys(tags)) {
            newMessages.push({
                type: 'refresh-package',
                repositoryUrl: message.repositoryUrl,
                identifier: tags[name],
                tag: name,
                force: force
            });
        }

        await this.queue.sendBatch(newMessages);
    }
}
