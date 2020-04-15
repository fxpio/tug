/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {Logger} from '@server/loggers/Logger';
import {MessageQueue} from '@server/queues/MessageQueue';
import {BaseReceiver} from '@server/receivers/BaseReceiver';
import {LooseObject} from '@server/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RefreshPackagesReceiver extends BaseReceiver {

    /**
     * Create the refresh package message.
     *
     * @param {string}  repositoryUrl The repository url
     * @param {string}  identifier    The identifier
     * @param {string}  version       The version
     * @param {boolean} force         Check if existing packages must be overridden
     *
     * @return {{type: string, repositoryUrl: string, identifier: string, version: string, force: boolean}}
     */
    private static createMessage(repositoryUrl: string, identifier: string, version: string, force: boolean): Object {
        return {
            type: 'refresh-package',
            repositoryUrl,
            identifier,
            version,
            force,
        };
    }
    private readonly repoManager: RepositoryManager;

    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager The repository manager
     * @param {MessageQueue}      queue       The message queue
     * @param {Logger}            logger      The logger
     */
    constructor(repoManager: RepositoryManager, queue: MessageQueue, logger: Logger) {
        super(queue, logger);
        this.repoManager = repoManager;
    }

    /**
     * @inheritDoc
     */
    public supports(message: LooseObject): boolean {
        return message && 'refresh-packages' === message.type;
    }

    /**
     * @inheritDoc
     */
    public async doExecute(message: LooseObject, res?: Response): Promise<void> {
        const force = true === message.force;
        const repo = await this.repoManager.getAndInitRepository(message.repositoryUrl, force, res);
        if (!repo) {
            this.logger.log('verbose', `[Refresh Packages Receiver] Repository is not found for "${message.repositoryUrl}"`);
            return;
        }

        const driver = repo.getDriver();
        const branches = await driver.getBranches();
        const tags = await driver.getTags();
        const newMessages = [];

        for (const name of Object.keys(branches)) {
            newMessages.push(RefreshPackagesReceiver.createMessage(message.repositoryUrl, branches[name], 'dev-' + name, force));
        }

        for (const name of Object.keys(tags)) {
            newMessages.push(RefreshPackagesReceiver.createMessage(message.repositoryUrl, tags[name], name, force));
        }

        await this.queue.sendBatch(newMessages);
    }
}
