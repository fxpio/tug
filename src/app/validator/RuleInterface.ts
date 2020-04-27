/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RuleInterface {
    /**
     * Get the unique name of the rule.
     */
    getName(): string;

    /**
     * Validate the value.
     */
    validate(value?: any): boolean|string;
}
