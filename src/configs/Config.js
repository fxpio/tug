/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import merge from 'lodash.merge';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Config
{
    static defaultConfig = {
        'github-domains': ['github.com'],
        'github-oauth': {},
        'github-webhook': {}
    };

    constructor() {
        this.config = Config.defaultConfig;
    }

    /**
     * Merge the new config values with the existing ones (overriding).
     *
     * @param {Config|Object} config The new config
     */
    merge(config) {
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
     * @return {*}
     */
    get(key) {
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
     * @return {Object}
     */
    all() {
        return this.config;
    }

    /**
     * Check if the setting key is defined.
     *
     * @param {string} key The key
     *
     * @return {boolean}
     */
    has(key) {
        return null !== this.get(key);
    }
}
