/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from '@app/db/constraints/Constraint';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Contains extends Constraint<string>
{
    /**
     * Constructor.
     *
     * @param {string} key
     * @param {string} value
     */
    constructor(key: string, value: string) {
        super('CONTAINS', key, value);
    }
}
