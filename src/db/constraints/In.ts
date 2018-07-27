/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from './Constraint';
import {generateToken} from '../../utils/token';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class In extends Constraint
{
    /**
     * Constructor.
     *
     * @param {any} value The value
     */
    constructor(value: any) {
        super('', value);

        let prefix = generateToken(4) + '_';

        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; ++i) {
                this.values[prefix + i] = value[i];
            }
        }
    }

    /**
     * @inheritDoc
     */
    public format(a: string, b: string): string {
        let keys = Object.keys(this.getCustomValues());

        return a + ' IN (' + (keys.length > 0 ? ':' : '') + keys.join(', :') + ')';
    }
}
