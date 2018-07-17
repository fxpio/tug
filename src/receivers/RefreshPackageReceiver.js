/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logger from '../loggers/Logger';
import MessageQueue from '../queues/MessageQueue';
import QueueReceiver from '../queues/QueueReceiver';
import RepositoryManager from '../composer/repositories/RepositoryManager';
import PackageManager from '../composer/packages/PackageManager';
import Package from '../composer/packages/Package';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RefreshPackageReceiver extends QueueReceiver
{
    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager    The repository manager
     * @param {PackageManager}    packageManager The package manager
     * @param {MessageQueue}      queue          The message queue
     * @param {Logger}            logger         The logger
     */
    constructor(repoManager, packageManager, queue, logger) {
        super();
        this.repoManager = repoManager;
        this.packageManager = packageManager;
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    supports(message) {
        return message && 'refresh-package' === message.type;
    }

    /**
     * @inheritDoc
     */
    async execute(message) {
        let force = true === message.force;
        let repoUrl = message.repositoryUrl;
        let identifier = message.identifier;
        let version = message.version;
        let isBranch = version.startsWith('dev-');

        let repo = await this.repoManager.getAndInitRepository(repoUrl, false);
        if (!repo || !repo.getPackageName()) {
            return;
        }

        let existingComposer = await this.packageManager.findPackage(repo.getPackageName(), version);

        if (force || !existingComposer) {
            let driver = repo.getDriver();
            let composer = await driver.getComposerInformation(identifier);

            if (!composer) {
                this.logger.log('warn', `[Refresh Package Receiver] Skipped ${isBranch ? 'branch' : 'tag'} (${version}) of "${repo.getPackageName()}", no composer file was found`);
                return;
            }

            if (composer['license'] && typeof composer['license'] === 'string') {
                composer['license'] = [composer['license']];
            }

            composer['type'] = composer['type'] ? composer['type'] : 'library';
            composer['version'] = version;
            composer['version_normalized'] = this.packageManager.normalizeVersion(version);
            composer['source'] = driver.getSource(identifier);
            composer['dist'] = driver.getDist(identifier);

            let pack = new Package({composer: composer});
            this.logger.log('info', `[Refresh Package Receiver] Refreshing package version "${pack.getVersion()}" for "${pack.getName()}"`);
            await this.packageManager.update(pack);
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: pack.getName()
            }, 1);
        }
    }
}
