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
export default class And extends Constraint
{
    /**
     * Constructor.
     *
     * @param {Array<Constraint>} constraints The constraints
     */
    constructor(constraints) {
        super('');
        this.constaints = constraints;

        for (let constraint of this.constaints) {
            if (constraint.hasValue()) {
                this.useValue = true;
                break;
            }
        }
    }

    /**
     * @inheritDoc
     */
    format(a, b) {
        let parts = [];

        for (let constraint of this.constaints) {
            parts.push(constraint.format(a, b));
        }

        return parts ? parts.join(' AND ') : '';
    }

    /**
     * @inheritDoc
     */
    getCustomValues() {
        let values = {};

        for (let constraint of this.constaints) {
            values = Object.assign(values, constraint.getCustomValues());
        }

        return values;
    }
};
