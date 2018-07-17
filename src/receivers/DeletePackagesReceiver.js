/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logger from '../loggers/Logger';
import QueueReceiver from '../queues/QueueReceiver';
import PackageRepository from '../db/repositories/PackageRepository';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class DeletePackagesReceiver extends QueueReceiver
{
    /**
     * Constructor.
     *
     * @param {PackageRepository} packageRepo The database package repository
     * @param {MessageQueue}      queue       The message queue
     * @param {Logger}            logger      The logger
     */
    constructor(packageRepo, queue, logger) {
        super();
        this.packageRepo = packageRepo;
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    supports(message) {
        return message && 'delete-packages' === message.type;
    }

    /**
     * @inheritDoc
     */
    async execute(message) {
        let res = await this.packageRepo.find({name: message.packageName});
        let ids = [];
        let versions = [];

        for (let item of res.results) {
            ids.push(item.id);
            versions.push(item.version);
        }

        this.logger.log('info', `[Delete Packages Receiver] Deleting package versions "${versions.join('", "')}" for "${message.packageName}"`);
        await this.packageRepo.deletes(ids);

        if (res.lastId) {
            await this.queue.send(message);
        } else {
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: message.packageName
            }, 1);
        }
    }
}
