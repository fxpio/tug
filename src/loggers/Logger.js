/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import LoggerError from '../errors/LoggerError';
import {isProd} from '../utils/server';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Logger
{
    /**
     * @return {Object}
     */
    static get LEVELS() {
        return {
            error: 0,
            warn: 1,
            info: 2,
            verbose: 3
        };
    }

    /**
     * Constructor.
     *
     * @param {String} level The level
     *
     * @throws LoggerError When the level does not exist
     */
    constructor(level = 'verbose') {
        this.level = validateLevel(level);
    }

    /**
     * Log a message by level.
     *
     * @param {String} level   The logger level
     * @param {*}      message The message
     *
     * @throws LoggerError When the level does not exist
     */
    log(level, message) {
        level = validateLevel(level);

        if (Logger.LEVELS[this.level] >= Logger.LEVELS[level]) {
            if (message instanceof Error) {
                message = isProd() ? message.message : message.stack;
            }
            console.info(`[${level.toUpperCase()}] ${message}`);
        }
    }
}

/**
 * Validate the logger level.
 *
 * @param {String} level The logger level
 *
 * @return {String}
 */
function validateLevel(level) {
    if (undefined === Logger.LEVELS[level]) {
        throw new LoggerError(`The logger level "${level}" does not exists, use: "${Object.keys(Logger.LEVELS).join('", "')}"`);
    }

    return level;
}
