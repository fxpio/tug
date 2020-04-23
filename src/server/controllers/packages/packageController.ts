/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Cache} from '@server/caches/Cache';
import {PackageBuilder} from '@server/composer/packages/PackageBuilder';
import {PackageManager} from '@server/composer/packages/PackageManager';
import {HttpNotFoundError} from '@server/errors/HttpNotFoundError';
import {LooseObject} from '@server/utils/LooseObject';
import {Request, Response} from 'express';

/**
 * Display the root packages.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showRootPackages(req: Request, res: Response, next: Function): Promise<void> {
    const cache: Cache = req.app.get('cache');
    const builder: PackageBuilder = req.app.get('package-builder');

    let content = await cache.getRootPackages();

    if (!content) {
        content = await builder.buildRootPackages(res);
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(await cache.setRootPackages(content));
}

/**
 * Display the package definition for a specific version.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showPackageVersion(req: Request, res: Response, next: Function): Promise<void> {
    const manager: PackageManager = req.app.get('package-manager');
    const packageName = req.params.vendor + '/' + req.params.package;
    const version = req.params.version;
    const resPackage = await manager.findPackage(packageName, version, res);

    if (resPackage) {
        res.json(resPackage.getComposer());
        return;
    }

    throw new HttpNotFoundError();
}

/**
 * Display the list of all package versions.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showPackageVersions(req: Request, res: Response, next: Function): Promise<void> {
    const cache: Cache = req.app.get('cache');
    const builder: PackageBuilder = req.app.get('package-builder');
    let packageName = req.params.vendor + '/' + req.params.package;
    let hash = null;
    const matchHash = packageName.match(/([a-zA-Z0-9\-_\/]+)\$([\w\d]+)/);

    if (matchHash) {
        packageName = matchHash[1];
        hash = matchHash[2];

        let content = await cache.getPackageVersions(packageName, hash);
        if (!content) {
            const result: LooseObject|null = await builder.buildVersions(packageName, hash, res);
            content = result ? result.content : null;
        }

        if (content) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(content);
            return;
        }
    }

    throw new HttpNotFoundError();
}

/**
 * Track the download of package version.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function trackDownloadBatch(req: Request, res: Response, next: Function): Promise<void> {
    const packageManager: PackageManager = req.app.get('package-manager');

    for (const track of req.body.downloads) {
        await packageManager.trackDownload(track.name, track.version, res);
    }

    res.status(204).send();
}
