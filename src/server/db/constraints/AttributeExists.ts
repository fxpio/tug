/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from '@server/db/constraints/Constraint';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AttributeExists extends Constraint<undefined> {
    /**
     * Constructor.
     *
     * @param {string} key
     */
    constructor(key: string) {
        super('EXISTS', key, undefined);
        this.values[key] = undefined;
    }
}
