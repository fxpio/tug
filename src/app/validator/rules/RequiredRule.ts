/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseRule} from '../BaseRule';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RequiredRule extends BaseRule {
    public static getName(): string {
        return 'required';
    }

    public validate(value?: any): boolean|string {
        return !!value || this.getMessage('This value is required');
    }
}
