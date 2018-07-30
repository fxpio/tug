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
export class And extends Constraint
{
    private readonly constraints: Constraint[];

    /**
     * Constructor.
     *
     * @param {Constraint[]} constraints The constraints
     */
    constructor(constraints: Constraint[]) {
        super('');
        this.constraints = constraints;

        for (let constraint of this.constraints) {
            if (constraint.hasValue()) {
                this.useValue = true;
                break;
            }
        }
    }

    /**
     * @inheritDoc
     */
    public format(a: string, b: string): string {
        let parts = [];

        for (let constraint of this.constraints) {
            parts.push(constraint.format(a, b));
        }

        return parts ? parts.join(' AND ') : '';
    }

    /**
     * @inheritDoc
     */
    public getCustomValues(): LooseObject {
        let values = {};

        for (let constraint of this.constraints) {
            values = Object.assign(values, constraint.getCustomValues());
        }

        return values;
    }
}
