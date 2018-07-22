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
import PackageBuilder from '../composer/packages/PackageBuilder';
import {LooseObject} from '../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BuildPackageVersionsReceiver implements QueueReceiver
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
    public async execute(message: LooseObject): Promise<void> {
        this.logger.log('info', `[Build Package Versions Receiver] Building all package versions for "${message.packageName}"`);
        await this.packageBuilder.buildVersions(message.packageName);
        this.logger.log('info', `[Build Package Versions Receiver] Building root packages for "${message.packageName}"`);
        await this.packageBuilder.buildRootPackages();
    }

    /**
     * @inheritDoc
     */
    public async finish(): Promise<void> {
    }
}
