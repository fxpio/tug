/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LoggerError} from '@server/errors/LoggerError';
import {LoggerInvalidLevelError} from '@server/errors/LoggerInvalidLevelError';
import {LooseObject} from '@server/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Logger {
    /**
     * @return {LooseObject}
     */
    public static get LEVELS(): LooseObject {
        return {
            error: 0,
            warn: 1,
            info: 2,
            verbose: 3,
        } as LooseObject;
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
            throw new LoggerInvalidLevelError(level, Object.keys(Logger.LEVELS));
        }

        return level;
    }

    private readonly level: string;
    private readonly debug: boolean;

    /**
     * Constructor.
     *
     * @param {string}  level The level
     * @param {boolean} debug The debug mode
     *
     * @throws LoggerError When the level does not exist
     */
    constructor(level: string = 'verbose', debug: boolean = false) {
        this.level = Logger.validateLevel(level);
        this.debug = debug;
    }

    /**
     * Log a message by level.
     *
     * @param {string} level The logger level
     * @param {*}            message The message
     *
     * @throws LoggerError When the level does not exist
     */
    public log(level: string, message: any): void {
        level = Logger.validateLevel(level);

        if (Logger.LEVELS[this.level] >= Logger.LEVELS[level]) {
            if (message instanceof Error) {
                message = this.debug ? message.stack : message.message;
            }
            console.info(`[${level.toUpperCase()}] ${message}`);
        }
    }
}
