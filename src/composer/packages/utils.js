/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PackageRepository from '../../db/repositories/PackageRepository';
import Not from '../../db/constraints/Not';
import In from '../../db/constraints/In';

/**
 * Retrieves all package versions.
 *
 * @param {String}            packageName The package name
 * @param {PackageRepository} packageRepo The database repository of composer repository
 * @param {Object}            packages    The packages
 * @param {String|null}       lastId      The last id of previous request
 *
 * @return {Promise<Object>}
 */
export async function retrieveAllVersions(packageName, packageRepo, packages, lastId = null) {
    let versionNames = Object.keys(packages);
    let criteria = {name: packageName};

    if (versionNames.length > 0) {
        criteria.version = new Not(new In(versionNames));
    }

    let res = await packageRepo.find(criteria, lastId);

    for (let packageData of res.results) {
        packages[packageData.package.version] = packageData.package;
    }

    if (res.lastId) {
        packages = retrieveAllVersions(packageName, packageRepo, packages, res.lastId);
    }

    return packages;
}
