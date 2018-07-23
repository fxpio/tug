/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from '../../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Constraint
{
    protected readonly operator: string;
    protected readonly value: any;
    protected readonly values: LooseObject;

    protected useValue: boolean;

    /**
     * Constructor.
     *
     * @param {string}  operator   The operator
     * @param {any}     [value]    The value
     * @param {boolean} [useValue] Check if the value is used by the constraint
     */
    constructor(operator: string, value: any = null, useValue = false) {
        this.operator = operator;
        this.value = value;
        this.useValue = useValue;
        this.values = {};
    }

    /**
     * Get the value.
     *
     * @return {any}
     */
    public getValue(): any {
        return this.value;
    }

    /**
     * Check if the value is used by the constraint.
     *
     * @return {boolean}
     */
    public hasValue(): boolean {
        return this.useValue;
    }

    /**
     * Get the custom values.
     *
     * @return {LooseObject}
     */
    public getCustomValues(): LooseObject {
        return this.values;
    }

    /**
     * Format the constraint.
     *
     * @param {string} a
     * @param {string} b
     *
     * @return {string}
     */
    public format(a: string, b: string): string {
        return a + ' ' + this.operator + ' ' + b;
    }
};
