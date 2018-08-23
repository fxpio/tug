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
export class Not extends Constraint<Constraint>
{
    /**
     * Constructor.
     *
     * @param {Constraint} constraint The constraint
     */
    constructor(constraint: Constraint) {
        super('NOT', constraint.getKey(), constraint);
        delete this.values[constraint.getKey()];
    }

    /**
     * @inheritDoc
     */
    public getValues(): LooseObject {
        return this.value.getValues();
    }
}
