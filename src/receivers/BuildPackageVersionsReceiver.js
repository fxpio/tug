/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logger from 'winston/lib/winston/logger';
import QueueReceiver from '../queues/QueueReceiver';
import PackageBuilder from '../composer/packages/PackageBuilder';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BuildPackageVersionsReceiver extends QueueReceiver
{
    /**
     * Constructor.
     *
     * @param {PackageBuilder} packageBuilder The package builder
     * @param {Logger}         logger         The logger
     */
    constructor(packageBuilder, logger) {
        super();
        this.packageBuilder = packageBuilder;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    supports(message) {
        return message && 'build-package-versions-cache' === message.type;
    }

    /**
     * @inheritDoc
     */
    async execute(message) {
        this.logger.log('info', `[Build Package Versions Receiver] Building all package versions has started for "${message.packageName}"`);
        await this.packageBuilder.buildVersions(message.packageName);
        this.logger.log('info', `[Build Package Versions Receiver] Building root packages has started for "${message.packageName}"`);
        await this.packageBuilder.buildRootPackages();
    }
}
