/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsRepository} from '@server/composer/repositories/VcsRepository';
import {Config} from '@server/configs/Config';
import {And} from '@server/db/constraints/And';
import {AttributeExists} from '@server/db/constraints/AttributeExists';
import {In} from '@server/db/constraints/In';
import {Not} from '@server/db/constraints/Not';
import {CodeRepositoryRepository} from '@server/db/repositories/CodeRepositoryRepository';
import {LooseObject} from '@server/utils/LooseObject';

/**
 * Retrieves all repositories.
 *
 * @param {Config}                   config       The config
 * @param {CodeRepositoryRepository} codeRepoRepo The database repository of composer repository
 * @param {LooseObject}              repositories The repositories
 * @param {boolean}                  forceAll     Check if all repositories must be returned
 *                                                or only returns the initialized repositories
 * @param {string}                   [lastId]     The last id of previous request
 *
 * @return {Promise<Object>}
 */
export async function retrieveAllRepositories(config: Config, codeRepoRepo: CodeRepositoryRepository, repositories: LooseObject, forceAll: boolean = false, lastId?: string): Promise<LooseObject> {
    const packagesNames = Object.keys(repositories);
    const criteria: LooseObject = {
        packageName: new AttributeExists('packageName'),
    };

    if (packagesNames.length > 0) {
        criteria.packageName = new And([criteria.packageName, new Not(new In('packageName', packagesNames))]);
    }

    if (!forceAll) {
        criteria.lastHash = new AttributeExists('lastHash');
    }

    const res = await codeRepoRepo.find(criteria, lastId);

    for (const repoData of res.getRows()) {
        const name = repoData.packageName ? repoData.packageName : repoData.id;
        repositories[name] = new VcsRepository(repoData, config);
    }

    if (res.hasLastId()) {
        repositories = retrieveAllRepositories(config, codeRepoRepo, repositories, forceAll, res.getLastId());
    }

    return repositories;
}
