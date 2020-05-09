/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Config} from '@server/configs/Config';
import {ConfigRepository} from '@server/db/repositories/ConfigRepository';
import {LooseObject} from '@server/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ConfigManager {
    private readonly configRepo: ConfigRepository;

    /**
     * Constructor.
     *
     * @param {ConfigRepository} configRepo
     */
    constructor(configRepo: ConfigRepository) {
        this.configRepo = configRepo;
    }

    /**
     * Get the config.
     *
     * @return Promise<Config>
     */
    public async get(): Promise<Config> {
        const config = new Config();
        const data: LooseObject|null = await this.configRepo.get('global');

        if (data) {
            delete data.id;
        }

        config.merge(data);

        return config;
    }

    /**
     * Put and save the new config.
     *
     * @param {Config|LooseObject} config The new config
     * @param {boolean}            replace Force to replace all values
     *
     * @return {Promise<Config>}
     */
    public async put(config: Config|LooseObject, replace: boolean = false): Promise<Config> {
        const currentConfig = replace ? new Config() : await this.get();
        currentConfig.merge(config);

        await this.configRepo.put(Object.assign({}, currentConfig.all(), {id: 'global'}));

        return currentConfig;
    }
}
