/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RepositoryError} from '@server/errors/RepositoryError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RepositoryNotFoundError extends RepositoryError
{
    public readonly url: string;

    /**
     * Constructor.
     *
     * @param {string} url The repository url
     */
    constructor(url: string) {
        super(`The repository with the url "${url}" is not found`);
        this.url = url;
    }
}
