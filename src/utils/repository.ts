/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsRepository} from '@app/composer/repositories/VcsRepository';
import {Config} from '@app/configs/Config';
import {And} from '@app/db/constraints/And';
import {AttributeExists} from '@app/db/constraints/AttributeExists';
import {In} from '@app/db/constraints/In';
import {Not} from '@app/db/constraints/Not';
import {CodeRepositoryRepository} from '@app/db/repositories/CodeRepositoryRepository';
import {LooseObject} from '@app/utils/LooseObject';

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
    let packagesNames = Object.keys(repositories);
    let criteria: LooseObject = {
        packageName: new AttributeExists()
    };

    if (packagesNames.length > 0) {
        criteria.packageName = new And([criteria.packageName, new Not(new In(packagesNames))]);
    }

    if (!forceAll) {
        criteria.lastHash = new AttributeExists();
    }

    let res = await codeRepoRepo.find(criteria, lastId);

    for (let repoData of res.getRows()) {
        let name = repoData.packageName ? repoData.packageName : repoData.id;
        repositories[name] = new VcsRepository(repoData, config);
    }

    if (res.hasLastId()) {
        repositories = retrieveAllRepositories(config, codeRepoRepo, repositories, forceAll, res.getLastId());
    }

    return repositories;
}
