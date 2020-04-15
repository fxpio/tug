/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from '@server/db/constraints/Constraint';
import {generateToken} from '@server/utils/token';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class In<V> extends Constraint<V> {
    /**
     * Constructor.
     *
     * @param {string} key   The key
     * @param {*}      value The value
     */
    constructor(key: string, value: V) {
        super('', key, value);

        this.values[key] = undefined;
        const prefix = generateToken(4) + '_';

        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; ++i) {
                this.values[prefix + i] = value[i];
            }
        }
    }
}
