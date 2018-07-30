/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Response} from 'express';
import {Logger} from '@app/loggers/Logger';
import {QueueReceiver} from '@app/queues/QueueReceiver';
import {PackageBuilder} from '@app/composer/packages/PackageBuilder';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BuildPackageVersionsReceiver implements QueueReceiver
{
    private readonly packageBuilder: PackageBuilder;
    private readonly logger: Logger;

    /**
     * Constructor.
     *
     * @param {PackageBuilder} packageBuilder The package builder
     * @param {Logger}         logger         The logger
     */
    constructor(packageBuilder: PackageBuilder, logger: Logger) {
        this.packageBuilder = packageBuilder;
        this.logger = logger;
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
    public async execute(message: LooseObject, res?: Response): Promise<void> {
        this.logger.log('info', `[Build Package Versions Receiver] Building all package versions for "${message.packageName}"`);
        await this.packageBuilder.buildVersions(message.packageName, undefined, res);
        this.logger.log('info', `[Build Package Versions Receiver] Building root packages for "${message.packageName}"`);
        await this.packageBuilder.buildRootPackages(res);
    }

    /**
     * @inheritDoc
     */
    public async finish(res?: Response): Promise<void> {
    }
}
