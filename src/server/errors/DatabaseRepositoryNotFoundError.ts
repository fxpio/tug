/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DatabaseError} from '@server/errors/DatabaseError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DatabaseRepositoryNotFoundError extends DatabaseError {
    public readonly name: string;

    /**
     * Constructor.
     *
     * @param {string} name The database repository name
     */
    constructor(name: string) {
        super(`The database repository "${name}" does not exist`);
        this.name = name;
    }
}
