/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Cache} from '@app/caches/Cache';
import {PackageBuilder} from '@app/composer/packages/PackageBuilder';
import {PackageManager} from '@app/composer/packages/PackageManager';
import {HttpNotFoundError} from '@app/errors/HttpNotFoundError';
import {LooseObject} from '@app/utils/LooseObject';
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
    let cache: Cache = req.app.get('cache');
    let builder: PackageBuilder = req.app.get('package-builder');

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
    let manager: PackageManager = req.app.get('package-manager');
    let packageName = req.params.vendor + '/' +req.params.package;
    let version = req.params.version;
    let resPackage = await manager.findPackage(packageName, version, res);

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
    let cache: Cache = req.app.get('cache');
    let builder: PackageBuilder = req.app.get('package-builder');
    let packageName = req.params.vendor + '/' + req.params.package;
    let hash = null;
    let matchHash = packageName.match(/([a-zA-Z0-9\-_\/]+)\$([\w\d]+)/);

    if (matchHash) {
        packageName = matchHash[1];
        hash = matchHash[2];

        let content = await cache.getPackageVersions(packageName, hash);
        if (!content) {
            let result:LooseObject|null = await builder.buildVersions(packageName, hash, res);
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
    let packageManager: PackageManager = req.app.get('package-manager');

    for (let track of req.body.downloads) {
        await packageManager.trackDownload(track.name, track.version, res);
    }

    res.status(204).send();
}
