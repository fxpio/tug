/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ConfigRepository} from '../db/repositories/ConfigRepository';
import {Config} from './Config';
import {LooseObject} from '../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ConfigManager
{
    private readonly configRepo: ConfigRepository;

    private config: Config|null;

    /**
     * Constructor.
     *
     * @param {ConfigRepository} configRepo
     */
    constructor(configRepo: ConfigRepository) {
        this.configRepo = configRepo;
        this.config = null;
    }

    /**
     * Get the config.
     *
     * @return Promise<Config>
     */
    public async get(): Promise<Config> {
        if (null === this.config) {
            this.config = new Config();
            let data: LooseObject|null = await this.configRepo.get('global');

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
     * @param {Config|LooseObject} config The new config
     *
     * @return {Promise<Config>}
     */
    public async put(config: Config|LooseObject): Promise<Config> {
        let currentConfig = await this.get();
        currentConfig.merge(config);

        await this.configRepo.put(Object.assign({}, currentConfig.all(), {id: 'global'}));

        return currentConfig;
    }
}
