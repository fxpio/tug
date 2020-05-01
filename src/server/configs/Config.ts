/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from '@server/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Config {
    public static defaultConfig: LooseObject = {
        'github-domains': ['github.com'],
        'github-oauth': {},
        'github-webhook': {},
        'ui': {
            locale: 'en',
        },
    };

    private config: LooseObject;

    /**
     * Constructor.
     */
    constructor() {
        this.config = Object.assign({}, Config.defaultConfig);
    }

    /**
     * Merge the new config values with the existing ones (overriding).
     *
     * @param {Config|LooseObject|null} config The new config
     */
    public merge(config: Config|LooseObject|null): void {
        if (config instanceof Config) {
            this.config = Object.assign(this.config, config.all());
        } else if (typeof config === 'object') {
            this.config = Object.assign(this.config, config);
        }
    }

    /**
     * Returns a setting.
     *
     * @param {string} key The key
     *
     * @return {*}
     */
    public get(key: string): any {
        const keys = key.split('[');
        let config = this.all();

        for (let i = 0; i < keys.length; ++i) {
            const subKey = keys[i].replace(/^[\['"`]+|[\]'"`]+$/g, '');

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
