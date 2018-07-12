/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Constraint
{
    /**
     * Constructor.
     *
     * @param {String}  operator The operator
     * @param {*}       value    The value
     * @param {Boolean} useValue Check if the value is used by the constraint
     */
    constructor(operator, value = null, useValue = false) {
        this.operator = operator;
        this.value = value;
        this.useValue = useValue;
        this.values = {};
    }

    /**
     * Get the value.
     *
     * @return {*}
     */
    getValue() {
        return this.value;
    }

    /**
     * Check if the value is used by the constraint.
     *
     * @return {Boolean}
     */
    hasValue() {
        return this.useValue;
    }

    /**
     * Get the custom values.
     *
     * @return {Object}
     */
    getCustomValues() {
        return this.values;
    }

    /**
     * Format the constraint.
     *
     * @param {String} a
     * @param {String} b
     *
     * @return {string}
     */
    format(a, b) {
        return a + ' ' + this.operator + ' ' + b;
    }
};
