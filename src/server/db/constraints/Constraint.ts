/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from '@server/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Constraint<V = any|undefined>
{
    protected readonly operator: string;
    protected readonly key: string;
    protected value: V;
    protected readonly values: LooseObject;

    /**
     * Constructor.
     *
     * @param {string}  operator   The operator
     * @param {string}  key        The key
     * @param {any}     [value]    The value
     */
    constructor(operator: string, key: string, value: V) {
        this.operator = operator;
        this.key = key;
        this.value = value;
        this.values = {};

        if (undefined !== value) {
            this.values[key] = value;
        }
    }

    /**
     * Get the operator.
     *
     * @return {string}
     */
    public getOperator(): string {
        return this.operator;
    }

    /**
     * Get the key.
     *
     * @return {string}
     */
    public getKey(): string {
        return this.key;
    }

    /**
     * Set the value.
     *
     * @param {any} value
     */
    public setValue(value: V): void {
        this.value = value;
    }

    /**
     * Get the value.
     *
     * @return {any}
     */
    public getValue(): V {
        return this.value;
    }

    /**
     * Get the custom values.
     *
     * @return {LooseObject}
     */
    public getValues(): LooseObject {
        return this.values;
    }
}
