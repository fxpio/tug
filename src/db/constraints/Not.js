/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Constraint from './Constraint';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Not extends Constraint
{
    /**
     * Constructor.
     *
     * @param {Constraint} constraint The constraint
     */
    constructor(constraint) {
        super('');
        this.constaint = constraint;
    }

    /**
     * @inheritDoc
     */
    format(a, b) {
        return 'NOT(' + this.constaint.format(a, b) + ')';
    }

    /**
     * @inheritDoc
     */
    getCustomValues() {
        return this.constaint.getCustomValues();
    }
};
