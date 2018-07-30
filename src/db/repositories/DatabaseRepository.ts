/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '@app/db/Database';
import {Results} from '@app/db/Results';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface DatabaseRepository
{
    /**
     * Check if the id exist.
     *
     * @param {string} id The id
     *
     * @return {Promise<boolean>}
     */
    has(id: string): Promise<boolean>;

    /**
     * Get the data of id or null if the id doesn't exist.
     *
     * @param {string} id The id
     *
     * @return {Promise<LooseObject|null>}
     */
    get(id: string): Promise<LooseObject|null>;

    /**
     * Put the data.
     *
     * @param {LooseObject} data The data
     *
     * @return {Promise<LooseObject>}
     */
    put(data: LooseObject): Promise<LooseObject>;

    /**
     * Delete the id.
     *
     * @param {string} id The id
     *
     * @return {Promise<string>}
     */
    delete(id: string): Promise<string>;

    /**
     * Delete the ids.
     *
     * @param {Array<string>} ids The ids
     *
     * @return {Promise<Array<string>>}
     */
    deletes(ids: string[]): Promise<Array<string>>;

    /**
     * Find the records.
     *
     * @param {LooseObject} criteria  The criteria
     * @param {string}      [startId] The start id
     *
     * @return {Promise<Results>}
     */
    find(criteria: LooseObject, startId?: string): Promise<Results>;

    /**
     * Find one record.
     *
     * @param {LooseObject} criteria The criteria
     *
     * @return {Promise<LooseObject>}
     */
    findOne(criteria: LooseObject): Promise<LooseObject>;

    /**
     * Prepare the criteria.
     *
     * @param {LooseObject} criteria The criteria
     *
     * @return {LooseObject}
     */
    prepareCriteria(criteria: LooseObject): LooseObject;

    /**
     * Get the prefix of id.
     *
     * @param {string} id The id
     *
     * @return {string}
     */
    getPrefixedId(id: string): string;

    /**
     * Clean the prefix on the data id.
     *
     * @param {LooseObject|string|null} data The data
     *
     * @return {LooseObject|string|null}
     */
    cleanPrefix(data: LooseObject|string|null): LooseObject|string|null;
}

/**
 * Interface of database repository constructor.
 */
export interface DatabaseRepositoryConstructor
{
    new (client: Database, prefix?: string): DatabaseRepository;

    /**
     * Get the name of repository.
     *
     * @return {string}
     */
    getName(): string;
}
