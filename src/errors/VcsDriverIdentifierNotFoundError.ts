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
export class VcsDriverIdentifierNotFoundError extends VcsDriverError
{
    public readonly type: string;
    public readonly name: string;

    /**
     * Constructor.
     *
     * @param {string} type The identifier type
     * @param {string} name The identifier name
     */
    constructor(type: string, name: string) {
        super(`${type} "${name}" is not found`);
        this.type = type;
        this.name = name;
    }
}
