/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsDriverIdentifierNotFoundError} from './VcsDriverIdentifierNotFoundError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VcsDriverTagNotFoundError extends VcsDriverIdentifierNotFoundError
{
    /**
     * Constructor.
     *
     * @param {string} tagName
     */
    constructor(tagName: string) {
        super('Tag', tagName);
    }
}
