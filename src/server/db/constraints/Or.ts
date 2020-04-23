/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ChildrenConstraint} from '@server/db/constraints/ChildrenConstraint';
import {Constraint} from '@server/db/constraints/Constraint';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Or extends ChildrenConstraint {
    /**
     * Constructor.
     *
     * @param {Constraint[]} constraints The constraints
     */
    constructor(constraints: Constraint[]) {
        super('OR', constraints);
    }
}
