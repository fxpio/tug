/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ConfigRepository from '../db/repositories/ConfigRepository';
import Config from './Config';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class ConfigManager
{
    /**
     * Constructor.
     *
     * @param {ConfigRepository} configRepo
     */
    constructor(configRepo) {
        this.configRepo = configRepo;
        this.config = null;
    }

    /**
     * Get the config.
     *
     * @return Config
     */
    async get() {
        if (null === this.config) {
            this.config = new Config();
            let data = await this.configRepo.get('global');

            if (data) {
                delete data.id;
            }

            this.config.merge(data);
        }

        return this.config;
    }

    /**
     * Put and save the new config.
     *
     * @param {Config|Object} config The new config
     *
     * @return {Promise<Config>}
     */
    async put(config) {
        let currentConfig = await this.get();
        currentConfig.merge(config);

        await this.configRepo.put(Object.assign({}, currentConfig.all(), {id: 'global'}));

        return currentConfig;
    }
}
