/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
     */
    constructor(packageBuilder) {
        super();
        this.packageBuilder = packageBuilder;
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
        await this.packageBuilder.buildVersions(message.packageName);
        await this.packageBuilder.buildRootPackages();
    }
}
