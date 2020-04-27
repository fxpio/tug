/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapRule} from './MapRule';
import {RuleInterface} from './RuleInterface';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface ValidatorInterface {
    /**
     * Get all rules defined in the validator.
     */
    getRules(): MapRule;

    /**
     * Check if the rule exist in the validator.
     *
     * @param {string} name The unique rule name
     *
     * @return {boolean}
     */
    hasRule(name: string): boolean;

    /**
     * Get the rule.
     *
     * @param {string} name The unique rule name
     *
     * @return {Rule}
     *
     * @throws ValidatorError When the rule does not exist
     */
    getRule(name: string): RuleInterface;

    /**
     * Get the validate function of the specific rule.
     *
     * @param {string} name The unique rule name
     *
     * @return Function
     *
     * @throws ValidatorError When the rule does not exist
     */
    r(name: string): (value?: any) => boolean|string;
}
