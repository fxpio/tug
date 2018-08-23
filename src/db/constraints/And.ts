/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ChildrenConstraint} from '@app/db/constraints/ChildrenConstraint';
import {Constraint} from '@app/db/constraints/Constraint';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class And extends ChildrenConstraint
{
    /**
     * Constructor.
     *
     * @param {Constraint[]} constraints The constraints
     */
    constructor(constraints: Constraint[]) {
        super('AND', constraints);
    }
}
