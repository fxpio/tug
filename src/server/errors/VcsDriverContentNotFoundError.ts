/*
 * This file is part of the Tug package.
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
export class VcsDriverContentNotFoundError extends VcsDriverError {
    public readonly fileUrl: string;
    public readonly identifier: string;

    /**
     * Constructor.
     *
     * @param {string} fileUrl    The file url
     * @param {string} identifier The identifier
     */
    constructor(fileUrl: string, identifier: string) {
        super(`Could not retrieve "${fileUrl}" for "${identifier}"`);
        this.fileUrl = fileUrl;
        this.identifier = identifier;
    }
}
