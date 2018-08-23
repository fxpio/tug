/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from '@app/db/constraints/Constraint';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ChildrenConstraint extends Constraint<Constraint[]>
{
    /**
     * Constructor.
     *
     * @param {string}       operator    The operator
     * @param {Constraint[]} constraints The constraints
     */
    constructor(operator: string, constraints: Constraint[]) {
        super(operator, '', constraints);
        delete this.values[''];
    }

    /**
     * @inheritDoc
     */
    public getValues(): LooseObject {
        let values = {};

        for (let constraint of <Constraint[]> this.getValue()) {
            values = Object.assign(values, constraint.getValues());
        }

        return values;
    }

    /**
     * Add constraint.
     *
     * @param {Constraint} constraint
     */
    public add(constraint: Constraint): void {
        this.value.push(constraint);
    }
}
