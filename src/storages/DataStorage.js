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
module.exports = class DataStorage
{
    /**
     * Check if the storage has the key.
     *
     * @param {String} key The key
     *
     * @return {Promise<boolean>}
     */
    async has(key) {
        return false;
    }

    /**
     * Put the data for the key. If data is undefined, a directory is created.
     *
     * @param {String}        key    The key
     * @param {String|Buffer} [data] The data
     *
     * @return {Promise<String>}
     */
    async put(key, data) {
        return key;
    }

    /**
     * Delete the key.
     *
     * @param {String} key The key
     *
     * @return {Promise<String>}
     */
    async delete(key) {
        return key;
    }
};
