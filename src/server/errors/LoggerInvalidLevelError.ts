/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LoggerError} from '@server/errors/LoggerError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class LoggerInvalidLevelError extends LoggerError {
    public readonly level: string;

    public readonly availableLevels: string[];

    /**
     * Constructor.
     *
     * @param {string}   level           The given level
     * @param {string[]} availableLevels The available levels
     */
    constructor(level: string, availableLevels: string[]) {
        super(`The logger level "${level}" does not exists, use: "${availableLevels.join('", "')}"`);
        this.level = level;
        this.availableLevels = availableLevels;
    }
}
