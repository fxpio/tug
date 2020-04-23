/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Package} from '@server/composer/packages/Package';
import {In} from '@server/db/constraints/In';
import {Not} from '@server/db/constraints/Not';
import {PackageRepository} from '@server/db/repositories/PackageRepository';
import {LooseObject} from '@server/utils/LooseObject';

/**
 * Retrieves all package versions.
 *
 * @param {string}            packageName The package name
 * @param {PackageRepository} packageRepo The database repository of composer repository
 * @param {Object}            packages    The packages
 * @param {string}           [lastId]     The last id of previous request
 *
 * @return {Promise<Object<string, Package>>}
 */
export async function retrieveAllVersions(packageName: string, packageRepo: PackageRepository, packages: LooseObject, lastId?: string): Promise<LooseObject> {
    const versionNames = Object.keys(packages);
    const criteria: LooseObject = {name: packageName};

    if (versionNames.length > 0) {
        criteria.version = new Not(new In('version', versionNames));
    }

    const res = await packageRepo.find(criteria, lastId);

    for (const packageData of res.getRows()) {
        const pack = new Package(packageData);
        packages[pack.getVersion()] = pack;
    }

    if (res.hasLastId()) {
        packages = retrieveAllVersions(packageName, packageRepo, packages, res.getLastId());
    }

    return packages;
}
