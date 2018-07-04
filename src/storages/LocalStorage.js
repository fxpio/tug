/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fs = require('fs-extra');

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
module.exports = class LocalStorage
{
    /**
     * Constructor.
     *
     * @param {String} basePath The base path
     */
    constructor(basePath) {
        this.basePath = basePath;
    }

    /**
     * Check if the storage has the key.
     *
     * @param {String} key The key
     *
     * @return {Promise<boolean>}
     */
    async has(key) {
        return fs.existsSync(this.basePath + '/' + key);
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
        if (undefined === data) {
            fs.ensureDirSync(this.basePath + '/' + key);
        } else {
            fs.outputFileSync(this.basePath + '/' + key.replace(/\/$/, ''), data)
        }

        return key;
    }
};
