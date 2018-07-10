/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Results
{
    /**
     * Constructor.
     *
     * @param {Array<Object>} results The results
     * @param {Number}        count   The count of result
     * @param {String|null}   lastId  The last id for the pagination
     */
    constructor(results, count, lastId = null) {
        this.results = results;
        this.count = count;
        this.lastId = lastId;
    }

    /**
     * Get the rows.
     *
     * @return {Array<Object>}
     */
    getRows() {
        return this.results;
    }

    /**
     * Get the count.
     *
     * @return {Number}
     */
    getCount() {
        return this.count;
    }

    /**
     * Check if the last id is defined.
     *
     * @return {Boolean}
     */
    hasLastId() {
        return null !== this.lastId;
    }

    /**
     * Get the last id for the pagination.
     *
     * @return {String|null}
     */
    getLastId() {
        return this.lastId;
    }
}