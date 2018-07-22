/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Constraint from './Constraint';
import {LooseObject} from '../../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Not extends Constraint
{
    private readonly constraint: Constraint;

    /**
     * Constructor.
     *
     * @param {Constraint} constraint The constraint
     */
    constructor(constraint: Constraint) {
        super('');
        this.constraint = constraint;
    }

    /**
     * @inheritDoc
     */
    public format(a: string, b: string): string {
        return 'NOT(' + this.constraint.format(a, b) + ')';
    }

    /**
     * @inheritDoc
     */
    public getCustomValues(): LooseObject {
        return this.constraint.getCustomValues();
    }
};
