/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DatabaseRepository from './repositories/DatabaseRepository';
import Results from './Results';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Database
{
    /**
     * Constructor.
     */
    constructor() {
        this.repositories = {};
    }

    /**
     * Set the repository.
     *
     * @param {Function}    repository The repository class
     * @param {String|null} name       The name of repository
     * @param {String|null} prefix     The prefix id of repository
     */
    setRepository(repository, name = null, prefix = null) {
        if (typeof repository === 'function' && repository.getName()) {
            name = name || repository.getName();
            this.repositories[name] = new repository(this, prefix);
        }
    }

    /**
     * Get the instance of the repository.
     *
     * @param {Function|String} repository The repository name
     *
     * @return {DatabaseRepository|*}
     */
    getRepository(repository) {
        let name = null;
        let type = typeof repository;

        if (type === 'string') {
            name = repository;
        } else if (repository.hasOwnProperty('getName')) {
            name = repository.getName();
        } else {
            throw new Error(`The repository attribute must be a string or a function, given type "${type}"`);
        }

        if (!this.repositories[name]) {
            throw new Error(`The repository "${name}" does not exist`);
        }

        return this.repositories[name];
    }

    /**
     * Check if the id exist.
     *
     * @param {String} id The id
     *
     * @return {Promise<boolean>}
     */
    async has(id) {
        return false;
    }

    /**
     * Get the data of id or null if the id doesn't exist.
     *
     * @param {String} id The id
     *
     * @return {Promise<String|null>}
     */
    async get(id) {
        return null;
    }

    /**
     * Put the data.
     *
     * @param {Object} data The data
     *
     * @return {Promise<Object>}
     */
    async put(data) {
        Database.validateData(data);

        return data;
    }

    /**
     * Delete the id.
     *
     * @param {String} id The id
     *
     * @return {Promise<String>}
     */
    async delete(id) {
        return id;
    }

    /**
     * Find the records.
     *
     * @param {Object}      criteria The criteria
     * @param {String|null} startId  The start id
     *
     * @return {Promise<Results>}
     */
    async find(criteria, startId = null) {
        return new Results([], 0);
    }

    /**
     * Find one record.
     *
     * @param {Object} criteria The criteria
     *
     * @return {Promise<Object|null>}
     */
    async findOne(criteria) {
        return null;
    }

    /**
     * Check if the data is valid.
     *
     * @param {*} data The data
     */
    static validateData(data) {
        if (typeof data !== 'object' || !data.id) {
            throw new Error('The data must be an object with the required "id" property');
        }
    }
};
