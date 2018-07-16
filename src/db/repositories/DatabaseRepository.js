/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Results from '../Results';
import Database from '../../db/Database';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class DatabaseRepository
{
    /**
     * Constructor.
     *
     * @param {Database}    client   The database client
     * @param {String|null} [prefix] The id prefix
     */
    constructor(client, prefix = null) {
        this.client = client;
        this.prefix = prefix;
    }

    /**
     * Check if the id exist.
     *
     * @param {String} id The id
     *
     * @return {Promise<boolean>}
     */
    async has(id) {
        return this.client.has(this.getPrefixedId(id));
    }

    /**
     * Get the data of id or null if the id doesn't exist.
     *
     * @param {String} id The id
     *
     * @return {Promise<Object|null>}
     */
    async get(id) {
        return this.cleanPrefix(await this.client.get(this.getPrefixedId(id)));
    }

    /**
     * Put the data.
     *
     * @param {Object} data The data
     *
     * @return {Promise<Object>}
     */
    async put(data) {
        if (data.id) {
            data.id = this.getPrefixedId(data.id);
        }

        if (this.prefix) {
            data.model = this.prefix;
        }

        return this.cleanPrefix(await this.client.put(data));
    }

    /**
     * Delete the id.
     *
     * @param {String} id The id
     *
     * @return {Promise<String>}
     */
    async delete(id) {
        return this.cleanPrefix(await this.client.delete(this.getPrefixedId(id)));
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
        let res = await this.client.find(this.prepareCriteria(criteria), startId);

        for (let item of res.getRows()) {
            this.cleanPrefix(item);
        }

        return res;
    }

    /**
     * Find one record.
     *
     * @param {Object} criteria The criteria
     *
     * @return {Promise<Object>}
     */
    async findOne(criteria) {
        return this.cleanPrefix(await this.client.findOne(this.prepareCriteria(criteria)));
    }

    /**
     * Prepare the criteria.
     *
     * @param {Object} criteria The criteria
     *
     * @return {Object}
     */
    prepareCriteria(criteria) {
        if (criteria.id) {
            criteria.id = this.getPrefixedId(criteria.id);
        }

        if (this.prefix) {
            criteria.model = this.prefix;
        }

        return criteria;
    }

    /**
     * Get the prefix of id.
     *
     * @param {String} id The id
     *
     * @return {String}
     */
    getPrefixedId(id) {
        return this.prefix ? this.prefix + ':' + id : id;
    }

    /**
     * Clean the prefix on the data id.
     *
     * @param {Object|String|null} data The data
     *
     * @return {Object|String|null}
     */
    cleanPrefix(data) {
        if (this.prefix && null !== data && typeof data === 'object' && data.id && typeof data.id === 'string') {
            data.id = data.id.replace(new RegExp('^' + this.prefix + ':', 'g'), '');
        } else if (typeof data === 'string') {
            data = data.replace(new RegExp('^' + this.prefix + ':', 'g'), '');
        }

        return data;
    }

    /**
     * Get the name of repository.
     *
     * @return {string}
     */
    static getName() {
        return '';
    }
};
