/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {NotEqual} from '@app/db/constraints/NotEqual';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class NotNull extends NotEqual
{
    /**
     * Constructor.
     */
    constructor() {
        super(null);
    }
}
