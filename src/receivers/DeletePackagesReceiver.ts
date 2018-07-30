/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PackageRepository} from '@app/db/repositories/PackageRepository';
import {Logger} from '@app/loggers/Logger';
import {MessageQueue} from '@app/queues/MessageQueue';
import {QueueReceiver} from '@app/queues/QueueReceiver';
import {LooseObject} from '@app/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DeletePackagesReceiver implements QueueReceiver
{
    private readonly packageRepo: PackageRepository;
    private readonly queue: MessageQueue;
    private readonly logger: Logger;

    /**
     * Constructor.
     *
     * @param {PackageRepository} packageRepo The database package repository
     * @param {MessageQueue}      queue       The message queue
     * @param {Logger}            logger      The logger
     */
    constructor(packageRepo: PackageRepository, queue: MessageQueue, logger: Logger) {
        this.packageRepo = packageRepo;
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    public supports(message: LooseObject): boolean {
        return message && 'delete-packages' === message.type;
    }

    /**
     * @inheritDoc
     */
    public async execute(message: LooseObject, res?: Response): Promise<void> {
        let result = await this.packageRepo.find({name: message.packageName});
        let ids = [];
        let versions = [];

        for (let item of result.getRows()) {
            ids.push(item.id);
            versions.push(item.version);
        }

        this.logger.log('info', `[Delete Packages Receiver] Deleting package versions "${versions.join('", "')}" for "${message.packageName}"`);
        await this.packageRepo.deletes(ids);

        if (result.hasLastId()) {
            await this.queue.send(message);
        } else {
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: message.packageName
            }, 1);
        }
    }

    /**
     * @inheritDoc
     */
    public async finish(res?: Response): Promise<void> {
    }
}
