/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsDriverError} from '@server/errors/VcsDriverError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VcsDriverInvalidJsonError extends VcsDriverError {
    public readonly repositoryDataUrl: string;
    public readonly message: string;

    /**
     * Constructor.
     *
     * @param {string} repositoryDataUrl The repository data url
     * @param {string} message           The error message
     */
    constructor(repositoryDataUrl: string, message: string) {
        super(`"${repositoryDataUrl}" does not contain valid JSON` + '\n' + message);
        this.repositoryDataUrl = repositoryDataUrl;
        this.message = message;
    }
}
