/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import merge from 'lodash.merge';
import {LooseObject} from '../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Config
{
    public static defaultConfig: LooseObject = {
        'github-domains': ['github.com'],
        'github-oauth': {},
        'github-webhook': {}
    };

    private config: LooseObject;

    /**
     * Constructor.
     */
    constructor() {
        this.config = merge({}, Config.defaultConfig);
    }

    /**
     * Merge the new config values with the existing ones (overriding).
     *
     * @param {Config|LooseObject|null} config The new config
     */
    public merge(config: Config|LooseObject|null): void {
        if (config instanceof Config) {
            this.config = merge(this.config, config.all());
        } else if (typeof config === 'object') {
            this.config = merge(this.config, config);
        }
    }

    /**
     * Returns a setting.
     *
     * @param {string} key The key
     *
     * @return {any}
     */
    public get(key: string): any {
        let keys = key.split('[');
        let config = this.all();

        for (let i = 0; i < keys.length; ++i) {
            let subKey = keys[i].replace(/^[\['"`]+|[\]'"`]+$/g, '');

            if (config.hasOwnProperty(subKey)) {
                if (keys.length - 1 > 0 && i < keys.length - 1) {
                    config = config[subKey];
                } else {
                    return config[subKey];
                }
            } else {
                break;
            }
        }

        return null;
    }

    /**
     * Get all config values.
     *
     * @return {LooseObject}
     */
    public all(): LooseObject {
        return this.config;
    }

    /**
     * Check if the setting key is defined.
     *
     * @param {string} key The key
     *
     * @return {boolean}
     */
    public has(key: string): boolean {
        return null !== this.get(key);
    }
}
