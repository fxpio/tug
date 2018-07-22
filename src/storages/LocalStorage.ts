/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fs from 'fs-extra';
import DataStorage from './DataStorage';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class LocalStorage implements DataStorage
{
    private readonly basePath: string;

    /**
     * Constructor.
     *
     * @param {string} basePath The base path
     */
    constructor(basePath: string) {
        this.basePath = basePath;
    }

    /**
     * @inheritDoc
     */
    public async has(key: string): Promise<boolean> {
        return fs.existsSync(this.basePath + '/' + key);
    }

    /**
     * @inheritDoc
     */
    public async get(key: string): Promise<string|null> {
        if (await this.has(key)) {
            return fs.readFileSync(this.basePath + '/' + key).toString();
        }

        return null;
    }

    /**
     * @inheritDoc
     */
    public async put(key: string, data: string|Buffer): Promise<string> {
        if (undefined === data) {
            fs.ensureDirSync(this.basePath + '/' + key);
        } else {
            fs.outputFileSync(this.basePath + '/' + key.replace(/\/$/, ''), data)
        }

        return key;
    }

    /**
     * @inheritDoc
     */
    public async delete(key: string): Promise<string> {
        fs.removeSync(this.basePath + '/' + key);

        return key;
    }
};
