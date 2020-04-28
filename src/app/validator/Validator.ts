/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapRule} from './MapRule';
import {MessageUtil} from './utils/MessageUtil';
import {ValidatorError} from './errors/ValidatorError';
import {RuleOptions} from './RuleOptions';
import {Rule, RuleConstructor} from './Rule';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Validator {
    protected readonly rules: MapRule = {};

    /**
     * Constructor.
     */
    public constructor(rules?: RuleConstructor[]) {
        rules = rules ?? [];

        for (const rule of rules) {
            if (typeof rule === 'function' && rule.getName()) {
                this.rules[rule.getName()] = rule;
            } else {
                throw new ValidatorError(`The rule "${rule}" is not valid`);
            }
        }
    }

    /**
     * Get all rules defined in the validator.
     */
    public getRules(): MapRule {
        return this.rules;
    }

    /**
     * Check if the rule exist in the validator.
     *
     * @param {string} name The unique rule name
     *
     * @return {boolean}
     */
    public hasRule(name: string): boolean {
        return undefined !== this.rules[name];
    }

    /**
     * Get the rule.
     *
     * @param {string}      name      The unique rule name
     * @param {RuleOptions} [options] The options of rule
     *
     * @return {Rule}
     *
     * @throws ValidatorError When the rule does not exist
     */
    public getRule(name: string, options?: RuleOptions): Rule {
        if (this.hasRule(name)) {
            const ruleConst = this.rules[name];

            return new ruleConst(options);
        }

        throw new ValidatorError(`The rule "${name}" does not exist in the validator`);
    }

    /**
     * Get the validate function of the specific rule.
     *
     * @param {string}      name      The unique rule name
     * @param {RuleOptions} [options] The options of rule
     *
     * @return Function
     *
     * @throws ValidatorError When the rule does not exist
     */
    public r(name: string, options?: RuleOptions): (value?: any) => boolean|string {
        const rule = this.getRule(name, options);

        return (value?: any): boolean|string => {
            return MessageUtil.replace(
                rule.validate(value),
                Object.assign({}, rule.getOptions(), {value}),
            );
        };
    }
}
