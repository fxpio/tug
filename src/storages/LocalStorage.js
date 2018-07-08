/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fs = require('fs-extra');
const DataStorage = require('./DataStorage');

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
module.exports = class LocalStorage extends DataStorage
{
    /**
     * Constructor.
     *
     * @param {String} basePath The base path
     */
    constructor(basePath) {
        super();
        this.basePath = basePath;
    }

    /**
     * @inheritDoc
     */
    async has(key) {
        return fs.existsSync(this.basePath + '/' + key);
    }

    /**
     * @inheritDoc
     */
    async get(key) {
        if (await this.has(key)) {
            return fs.readFileSync(this.basePath + '/' + key).toString();
        }

        return null;
    }

    /**
     * @inheritDoc
     */
    async put(key, data) {
        if (undefined === data) {
            fs.ensureDirSync(this.basePath + '/' + key);
        } else {
            fs.outputFileSync(this.basePath + '/' + key.replace(/\/$/, ''), data)
        }

        return super.put(key, data);
    }

    /**
     * @inheritDoc
     */
    async delete(key) {
        fs.removeSync(this.basePath + '/' + key);

        return super.delete(key);
    }
};
