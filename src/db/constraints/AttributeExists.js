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
export default class AttributeExists extends Constraint
{
    /**
     * Constructor.
     */
    constructor() {
        super('');
    }

    /**
     * @inheritDoc
     */
    format(a, b) {
        return 'attribute_exists(' + a + ')';
    }
};
