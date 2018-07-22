/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DatabaseError from '../errors/DatabaseError';
import {DatabaseRepository, DatabaseRepositoryConstructor} from './repositories/DatabaseRepository';
import Results from './Results';
import {LooseObject} from '../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Database
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
    public getRepository(repository: DatabaseRepositoryConstructor|string): DatabaseRepository {
        let name = null;

        if (typeof repository === 'string') {
            name = repository;
        } else if (repository.hasOwnProperty('getName')) {
            name = repository.getName();
        } else {
            throw new DatabaseError(`The repository attribute must be a string or a function, given type "${typeof repository}"`);
        }

        if (!this.repositories[name]) {
            throw new DatabaseError(`The repository "${name}" does not exist`);
        }

        return this.repositories[name];
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
     * @param {LooseObject} criteria The criteria
     * @param {string}      [startId]  The start id
     *
     * @return {Promise<Results>}
     */
    public async find(criteria: LooseObject, startId?: string): Promise<Results> {
        return new Results([], 0);
    }

    /**
     * Find one record.
     *
     * @param {LooseObject} criteria The criteria
     *
     * @return {Promise<LooseObject|null>}
     */
    public async findOne(criteria: LooseObject): Promise<LooseObject|null> {
        return null;
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
            throw new DatabaseError('The data must be an object with the required "id" property');
        }
    }
};
