/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs-extra');

/**
 * Load the env variables.
 *
 * @return {object}
 */
module.exports.loadEnvs = function() {
    const envFile = path.resolve('./.env');
    let envs = {};

    if (fs.existsSync(envFile)) {
        envs = Object.assign({}, dotenv.parse(fs.readFileSync(envFile)), envs);
    }

    return envs;
};
