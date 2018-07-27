/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsDriverError} from './VcsDriverError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VcsDriverInvalidUrlError extends VcsDriverError
{
    public readonly vcsType: string;
    public readonly url: string;

    /**
     * Constructor.
     *
     * @param {string} url     The repository url
     * @param {string} vcsType The vcs driver type
     */
    constructor(vcsType: string, url: string) {
        super(`The url "${url}" is not a valid url for the ${vcsType} vcs driver`);
        this.vcsType = vcsType;
        this.url = url;
    }
}
