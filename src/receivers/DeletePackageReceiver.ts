/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PackageManager} from '@app/composer/packages/PackageManager';
import {Logger} from '@app/loggers/Logger';
import {MessageQueue} from '@app/queues/MessageQueue';
import {BaseReceiver} from '@app/receivers/BaseReceiver';
import {LooseObject} from '@app/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DeletePackageReceiver extends BaseReceiver
{
    private packageManager: PackageManager;

    /**
     * Constructor.
     *
     * @param {PackageManager} packageManager The package manager
     * @param {MessageQueue}   queue          The message queue
     * @param {Logger}         logger         The logger
     */
    constructor(packageManager: PackageManager, queue: MessageQueue, logger: Logger) {
        super(queue, logger);
        this.packageManager = packageManager;
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
    public async doExecute(message: LooseObject, res?: Response): Promise<void> {
        let pack = await this.packageManager.findPackage(message.packageName, message.version, res);

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
}
