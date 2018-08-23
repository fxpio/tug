/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {And} from '@app/db/constraints/And';
import {Contains} from '@app/db/constraints/Contains';
import {Or} from '@app/db/constraints/Or';
import {Query} from '@app/db/constraints/Query';
import {DatabaseRepository, DatabaseRepositoryConstructor} from '@app/db/repositories/DatabaseRepository';
import {Results} from '@app/db/Results';
import {DatabaseError} from '@app/errors/DatabaseError';
import {DatabaseInvalidAttributeError} from '@app/errors/DatabaseInvalidAttributeError';
import {DatabaseRepositoryNotFoundError} from '@app/errors/DatabaseRepositoryNotFoundError';
import {DatabaseUnexpectedDataError} from '@app/errors/DatabaseUnexpectedDataError';
import {criteriaToQuery} from '@app/utils/dynamodb';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Database
{
    private readonly repositories: LooseObject;

    /**
     * Constructor.
     */
    constructor() {
        this.repositories = {};
    }

    /**
     * Set the repository.
     *
     * @param {DatabaseRepositoryConstructor} repository The repository class
     * @param {string}   [name]     The name of repository
     * @param {string}   [prefix]   The prefix id of repository
     */
    public setRepository(repository: DatabaseRepositoryConstructor, name?: string, prefix?: string): void {
        if (typeof repository === 'function' && repository.getName()) {
            name = name || repository.getName();
            this.repositories[name] = new repository(this, prefix);
        }
    }

    /**
     * Get the instance of the repository.
     *
     * @param {DatabaseRepositoryConstructor|string} repository The repository name
     *
     * @return {DatabaseRepository}
     *
     * @throws DatabaseError When the repository attribute is not a string or a function
     * @throws DatabaseError When the repository does not exist
     */
    public getRepository<T extends DatabaseRepository>(repository: DatabaseRepositoryConstructor|string): T {
        let name = null;

        if (typeof repository === 'string') {
            name = repository;
        } else if (repository.hasOwnProperty('getName')) {
            name = repository.getName();
        } else {
            throw new DatabaseInvalidAttributeError('repository', repository);
        }

        if (!this.repositories[name]) {
            throw new DatabaseRepositoryNotFoundError(name);
        }

        return this.repositories[name] as T;
    }

    /**
     * Check if the id exist.
     *
     * @param {string} id The id
     *
     * @return {Promise<boolean>}
     */
    public async has(id: string): Promise<boolean> {
        return false;
    }

    /**
     * Get the data of id or null if the id doesn't exist.
     *
     * @param {string} id The id
     *
     * @return {Promise<LooseObject|null>}
     */
    public async get(id: string): Promise<LooseObject|null> {
        return null;
    }

    /**
     * Put the data.
     *
     * @param {LooseObject} data The data
     *
     * @return {Promise<LooseObject>}
     *
     * @throws Error When the data object has not the id property
     */
    public async put(data: LooseObject): Promise<LooseObject> {
        Database.validateData(data);

        return data;
    }

    /**
     * Delete the id.
     *
     * @param {string} id The id
     *
     * @return {Promise<string>}
     */
    public async delete(id: string): Promise<string> {
        return id;
    }

    /**
     * Delete the ids.
     *
     * @param {Array<string>} ids The ids
     *
     * @return {Promise<string[]>}
     */
    public async deletes(ids: string[]): Promise<string[]> {
        return ids;
    }

    /**
     * Find the records.
     *
     * @param {Query|LooseObject} criteria  The criteria or query
     * @param {string}            [startId] The start id
     *
     * @return {Promise<Results>}
     */
    public async find(criteria: Query|LooseObject, startId?: string): Promise<Results> {
        return new Results([], 0);
    }

    /**
     * Find one record.
     *
     * @param {Query|LooseObject} criteria The criteria or query
     *
     * @return {Promise<LooseObject|null>}
     */
    public async findOne(criteria: Query|LooseObject): Promise<LooseObject|null> {
        return null;
    }

    /**
     * Search the records.
     *
     * @param {Query|LooseObject} criteria  The criteria or query
     * @param {string[]}          fields    The fields
     * @param {string}            [search]  The search value
     * @param {string}            [startId] The start id
     *
     * @return {Promise<Results>}
     */
    public async search(criteria: Query|LooseObject, fields: string[], search?: string, startId?: string): Promise<Results> {
        let query = criteriaToQuery(criteria);

        if (search) {
            let or = new Or([]);
            let prevConstraint = query.getConstraint();

            for (let i = 0; i < fields.length; ++i) {
                or.add(new Contains(fields[i], search));
            }

            let constraint = prevConstraint instanceof And ? <And> prevConstraint : new And([prevConstraint]);
            constraint.add(or);
            query.setConstraint(constraint);
        }

        return this.find(query, startId);
    }

    /**
     * Check if the data is valid.
     *
     * @param {*} data The data
     *
     * @throws DatabaseError When the data object has not the id property
     */
    public static validateData(data: any): void {
        if (typeof data !== 'object' || !data.id) {
            throw new DatabaseUnexpectedDataError(data);
        }
    }
}
