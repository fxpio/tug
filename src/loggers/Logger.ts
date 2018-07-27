/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LoggerError} from '../errors/LoggerError';
import {LooseObject} from '../utils/LooseObject';
import {isProd} from '../utils/server';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Logger
{
    /**
     * @return {LooseObject}
     */
    public static get LEVELS(): LooseObject {
        return {
            error: 0,
            warn: 1,
            info: 2,
            verbose: 3
        } as LooseObject;
    }

    private readonly level: string;

    /**
     * Constructor.
     *
     * @param {string} level The level
     *
     * @throws LoggerError When the level does not exist
     */
    constructor(level: string = 'verbose') {
        this.level = Logger.validateLevel(level);
    }

    /**
     * Log a message by level.
     *
     * @param {string} level The logger level
     * @param {any}          message The message
     *
     * @throws LoggerError When the level does not exist
     */
    public log(level: string, message: any): void {
        level = Logger.validateLevel(level);

        if (Logger.LEVELS[this.level] >= Logger.LEVELS[level]) {
            if (message instanceof Error) {
                message = isProd() ? message.message : message.stack;
            }
            console.info(`[${level.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Validate the logger level.
     *
     * @param {string} level The logger level
     *
     * @return {string}
     */
    private static validateLevel(level: string): string {
        if (undefined === Logger.LEVELS[level]) {
            throw new LoggerError(`The logger level "${level}" does not exists, use: "${Object.keys(Logger.LEVELS).join('", "')}"`);
        }

        return level;
    }
}
