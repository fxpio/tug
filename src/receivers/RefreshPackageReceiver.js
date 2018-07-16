/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
     */
    constructor(repoManager, packageManager, queue) {
        super();
        this.repoManager = repoManager;
        this.packageManager = packageManager;
        this.queue = queue;
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
        let branch = message.branch ? 'dev-' + message.branch : null;
        let tag = message.tag ? message.tag : null;
        let version = branch ? branch : tag;

        let repo = await this.repoManager.getAndInitRepository(repoUrl, false);
        if (!repo || !repo.getPackageName()) {
            return;
        }

        let existingComposer = await this.packageManager.findPackage(repo.getPackageName(), version);

        if (force || !existingComposer) {
            let driver = repo.getDriver();
            let composer = await driver.getComposerInformation(identifier);

            if (!composer) {
                console.warn('[WARNING]', `Skipped ${branch ? 'branch' : 'tag'} (${version}) of "${repo.getPackageName()}", no composer file was found`);
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
            await this.packageManager.update(pack);
            await this.queue.send({
                type: 'build-package-versions-cache',
                packageName: pack.getName()
            }, 1);
        }
    }
}
