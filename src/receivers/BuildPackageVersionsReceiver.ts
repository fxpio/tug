/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PackageBuilder} from '@app/composer/packages/PackageBuilder';
import {Logger} from '@app/loggers/Logger';
import {MessageQueue} from '@app/queues/MessageQueue';
import {BaseReceiver} from '@app/receivers/BaseReceiver';
import {LooseObject} from '@app/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BuildPackageVersionsReceiver extends BaseReceiver
{
    private readonly packageBuilder: PackageBuilder;

    /**
     * Constructor.
     *
     * @param {PackageBuilder} packageBuilder The package builder
     * @param {MessageQueue}   queue          The message queue
     * @param {Logger}         logger         The logger
     */
    constructor(packageBuilder: PackageBuilder, queue: MessageQueue, logger: Logger) {
        super(queue, logger);
        this.packageBuilder = packageBuilder;
    }

    /**
     * @inheritDoc
     */
    public supports(message: LooseObject): boolean {
        return message && 'build-package-versions-cache' === message.type;
    }

    /**
     * @inheritDoc
     */
    public async doExecute(message: LooseObject, res?: Response): Promise<void> {
        this.logger.log('info', `[Build Package Versions Receiver] Building all package versions for "${message.packageName}"`);
        await this.packageBuilder.buildVersions(message.packageName, undefined, res);
        this.logger.log('info', `[Build Package Versions Receiver] Building root packages for "${message.packageName}"`);
        await this.packageBuilder.buildRootPackages(res);
    }
}
