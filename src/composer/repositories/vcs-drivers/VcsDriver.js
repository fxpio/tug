/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Config from '../../../configs/Config';
import DataStorage from '../../../storages/DataStorage';

/**
 * A driver implementation for driver.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsDriver
{
    /**
     * Constructor.
     *
     * @param {Config}      config  The config
     * @param {DataStorage} storage The cache data storage
     */
    constructor(config, storage) {
        this.config = config;
    }

    /**
     * Checks if this driver can handle a given url.
     *
     * @param {Config}  config The config
     * @param {string}  url    URL to validate/check
     * @param {Boolean} [deep] Unless true, only shallow checks (url matching typically) should be done
     *
     * @return {Boolean}
     */
    static supports(config, url, deep = false) {
        return false;
    }
}
