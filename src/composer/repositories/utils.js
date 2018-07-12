/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CodeRepositoryRepository from '../../db/repositories/CodeRepositoryRepository';
import Config from '../../configs/Config';
import AttributeExists from '../../db/constraints/AttributeExists';
import And from '../../db/constraints/And';
import Not from '../../db/constraints/Not';
import In from '../../db/constraints/In';
import VcsRepository from './VcsRepository';

/**
 * Retrieves all repositories.
 *
 * @param {Config}                   config       The config
 * @param {CodeRepositoryRepository} codeRepoRepo The database repository of composer repository
 * @param {Object}                   repositories The repositories
 * @param {Boolean}                  forceAll     Check if all repositories must be returned
 *                                                or only returns the initialized repositories
 * @param {String|null}              lastId       The last id of previous request
 *
 * @return {Promise<Object>}
 */
export async function retrieveAllRepositories(config, codeRepoRepo, repositories, forceAll = false, lastId = null) {
    let packagesNames = Object.keys(repositories);
    let criteria = {
        packageName: new AttributeExists()
    };

    if (packagesNames.length > 0) {
        criteria.packageName = new And([criteria.packageName, new Not(new In(packagesNames))]);
    }

    if (!forceAll) {
        criteria.lastHash = new AttributeExists()
    }

    let res = await codeRepoRepo.find(criteria, lastId);

    for (let repoData of res.results) {
        let repoConfig = {url: repoData.url, type: repoData.type, data: repoData};
        repositories[repoData.packageName] = new VcsRepository(repoConfig, config, codeRepoRepo);
    }

    if (res.lastId) {
        repositories = retrieveAllRepositories(config, codeRepoRepo, repositories, forceAll, res.lastId);
    }

    return repositories;
}
