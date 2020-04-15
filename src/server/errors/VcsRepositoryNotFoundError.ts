/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsRepositoryError} from '@server/errors/VcsRepositoryError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VcsRepositoryNotFoundError extends VcsRepositoryError {
    public readonly url: string;

    /**
     * Constructor.
     *
     * @param {string} url The repository url
     */
    constructor(url: string) {
        super(`No driver found to handle VCS repository ${url}`);
        this.url = url;
    }
}
