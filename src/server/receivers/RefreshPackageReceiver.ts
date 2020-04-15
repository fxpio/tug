/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Package} from '@server/composer/packages/Package';
import {PackageManager} from '@server/composer/packages/PackageManager';
import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {Logger} from '@server/loggers/Logger';
import {MessageQueue} from '@server/queues/MessageQueue';
import {BaseReceiver} from '@server/receivers/BaseReceiver';
import {LooseObject} from '@server/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RefreshPackageReceiver extends BaseReceiver {
    private readonly repoManager: RepositoryManager;
    private readonly packageManager: PackageManager;

    /**
     * Constructor.
     *
     * @param {RepositoryManager} repoManager    The repository manager
     * @param {PackageManager}    packageManager The package manager
     * @param {MessageQueue}      queue          The message queue
     * @param {Logger}            logger         The logger
     */
    constructor(repoManager: RepositoryManager, packageManager: PackageManager, queue: MessageQueue, logger: Logger) {
        super(queue, logger);
        this.repoManager = repoManager;
        this.packageManager = packageManager;
    }

    /**
     * @inheritDoc
     */
    public supports(message: LooseObject): boolean {
        return message && 'refresh-package' === message.type;
    }

    /**
     * @inheritDoc
     */
    public async doExecute(message: LooseObject, res?: Response): Promise<void> {
        const force = true === message.force;
        const repoUrl = message.repositoryUrl;
        const identifier = message.identifier;
        const version = message.version;
        const isBranch = version.startsWith('dev-');

        const repo = await this.repoManager.getAndInitRepository(repoUrl, false, res);
        if (!repo || !repo.getPackageName()) {
            return;
        }

        const existingComposer = await this.packageManager.findPackage(repo.getPackageName() as string, version, res);

        if (force || !existingComposer) {
            const driver = repo.getDriver();
            const composer = await driver.getComposerInformation(identifier);

            if (!composer) {
                this.logger.log('warn', `[Refresh Package Receiver] Skipped ${isBranch ? 'branch' : 'tag'} (${version}) of "${repo.getPackageName()}", no composer file was found`);
                return;
            }

            if (composer.license && typeof composer.license === 'string') {
                composer.license = [composer.license];
            }

            composer.type = composer.type ? composer.type : 'library';
            composer.version = version;
            composer.version_normalized = this.packageManager.normalizeVersion(version);
            composer.source = driver.getSource(identifier);
            composer.dist = driver.getDist(identifier);

            const pack = new Package({composer});
            this.logger.log('info', `[Refresh Package Receiver] Refreshing package version "${pack.getVersion()}" for "${pack.getName()}"`);
            await this.packageManager.update(pack);
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: pack.getName(),
            }, 1);
        }
    }
}
