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
import DataStorage from '../../storages/DataStorage';
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
 * @param {DataStorage}              cache        The cache storage
 * @param {Object}                   repositories The repositories
 * @param {String|null}              lastId       The last id of previous request
 *
 * @return {Promise<Object>}
 */
export async function retrieveAllRepositories(config, codeRepoRepo, cache, repositories, lastId = null) {
    let packageConstraint = new AttributeExists();
    let packagesNames = Object.keys(repositories);

    if (packagesNames.length > 0) {
        packageConstraint = new And([packageConstraint, new Not(new In(packagesNames))]);
    }

    let res = await codeRepoRepo.find({packageName: packageConstraint}, lastId);

    for (let repoData of res.results) {
        let repoConfig = {url: repoData.url, type: repoData.type, data: repoData};
        repositories[repoData.packageName] = new VcsRepository(repoConfig, config, codeRepoRepo, cache);
    }

    if (res.lastId) {
        repositories = retrieveAllRepositories(config, codeRepoRepo, cache, repositories, res.lastId);
    }

    return repositories;
}
