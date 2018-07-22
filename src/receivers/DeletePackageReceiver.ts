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
import PackageManager from '../composer/packages/PackageManager';
import MessageQueue from '../queues/MessageQueue';
import {LooseObject} from '../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class DeletePackageReceiver implements QueueReceiver
{
    private packageManager: PackageManager;
    private queue: MessageQueue;
    private logger: Logger;

    /**
     * Constructor.
     *
     * @param {PackageManager} packageManager The package manager
     * @param {MessageQueue}   queue          The message queue
     * @param {Logger}         logger         The logger
     */
    constructor(packageManager: PackageManager, queue: MessageQueue, logger: Logger) {
        this.packageManager = packageManager;
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    public supports(message: LooseObject): boolean {
        return message && 'delete-package' === message.type;
    }

    /**
     * @inheritDoc
     */
    public async execute(message: LooseObject): Promise<void> {
        let pack = await this.packageManager.findPackage(message.packageName, message.version);

        if (pack) {
            this.logger.log('info', `[Delete Package Receiver] Deleting package version "${message.version}" for "${message.packageName}"`);
            await this.packageManager.delete(pack);
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: message.packageName
            }, 1);
        } else {
            this.logger.log('verbose', `[Delete Package Receiver] Package version "${message.version}" is not found for "${message.packageName}"`);
        }
    }

    /**
     * @inheritDoc
     */
    public async finish(): Promise<void> {
    }
}
