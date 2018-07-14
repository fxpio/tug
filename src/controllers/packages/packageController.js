/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import RepositoryManager from '../../composer/repositories/RepositoryManager';
import PackageManager from '../../composer/packages/PackageManager';
import Cache from '../../caches/Cache';
import HttpNotFoundError from '../../errors/HttpNotFoundError';

/**
 * Display the root packages.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showRootPackages(req, res, next) {
    /** @type Cache cache */
    let cache = req.app.set('cache');
    /** @type RepositoryManager manager */
    let manager = req.app.set('repository-manager');
    let includes = {};

    let content = await cache.getRootPackages();

    if (!content) {
        let repos = await manager.getRepositories();
        for (let key of Object.keys(repos)) {
            let name = repos[key].getPackageName();
            let hash = repos[key].getLastHash();
            includes[`p/${name}$${hash}.json`] = {'sha1': hash};
        }
        content = JSON.stringify({packages: {}, includes: includes});
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(await cache.setRootPackages(content));
}

/**
 * Display the package definition for a specific version.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showPackageVersion(req, res, next) {
    /** @type PackageManager manager */
    let manager = req.app.set('package-manager');
    let packageName = req.params.vendor + '/' +req.params.package;
    let version = req.params.version;
    let resPackage = await manager.findPackage(packageName, version);

    if (resPackage) {
        res.json(resPackage);
        return;
    }

    throw new HttpNotFoundError();
}

/**
 * Display the list of all package versions.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showPackageVersions(req, res, next) {
    /** @type Cache cache */
    let cache = req.app.set('cache');
    /** @type PackageManager manager */
    let manager = req.app.set('package-manager');
    let packageName = req.params.vendor + '/' + req.params.package;
    let hash = null;
    let matchHash = packageName.match(/([a-zA-Z0-9\-_\/]+)\$([\w\d]+)/);

    if (matchHash) {
        packageName = matchHash[1];
        hash = matchHash[2];
    }

    let content = await cache.getPackageVersions(packageName, hash);

    if (!content) {
        let resPackages = await manager.findPackages(packageName, hash);
        if (Object.keys(resPackages).length > 0) {
            let data = {packages: {}};
            data.packages[packageName] = {};
            for (let version of Object.keys(resPackages)) {
                let pack = resPackages[version];
                data.packages[packageName][pack.getVersion()] = pack.getComposer();
            }
            content = JSON.stringify(data);
        }
    }

    if (content) {
        if (hash) {
            await cache.setPackageVersions(packageName, hash, content);
        }
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(content);
        return;
    }

    throw new HttpNotFoundError();
}
