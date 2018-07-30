/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DatabaseError} from '@app/errors/DatabaseError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DatabaseInvalidAttributeError extends DatabaseError
{
    public readonly attribute: string;
    public readonly givenType: string;
    public readonly value: any;

    /**
     * Constructor.
     *
     * @param {string} attribute The attribute name
     * @param {string} value     The value
     */
    constructor(attribute: string, value: any) {
        super(`The "${attribute}" attribute must be a string or a function, given type "${typeof value}"`);
        this.attribute = attribute;
        this.givenType = typeof value;
        this.value = value;
    }
}
