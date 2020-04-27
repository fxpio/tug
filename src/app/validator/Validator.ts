/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapRule} from './MapRule';
import {ValidatorError} from './errors/ValidatorError';
import {ValidatorInterface} from './ValidatorInterface';
import {RuleInterface} from './RuleInterface';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Validator implements ValidatorInterface {
    private readonly rules: MapRule = {};

    /**
     * Constructor.
     */
    constructor(rules?: RuleInterface[]) {
        rules = rules ?? [];

        for (const rule of rules) {
            this.rules[rule.getName()] = rule;
        }
    }

    public getRules(): MapRule {
        return this.rules;
    }

    public hasRule(name: string): boolean {
        return undefined !== this.rules[name];
    }

    public getRule(name: string): RuleInterface {
        if (this.hasRule(name)) {
            return this.rules[name];
        }

        throw new ValidatorError(`The rule "${name}" does not exist in the validator`);
    }

    public r(name: string): (value?: any) => boolean|string {
        return this.getRule(name).validate;
    }
}
