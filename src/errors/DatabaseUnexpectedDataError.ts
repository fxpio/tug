/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DatabaseError} from './DatabaseError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DatabaseUnexpectedDataError extends DatabaseError
{
    public readonly value: any;

    /**
     * Constructor.
     *
     * @param {string} value The value
     */
    constructor(value: any) {
        super('The data must be an object with the required "id" property');
        this.value = value;
    }
}
