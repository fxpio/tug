/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '../Database';
import {BaseDatabaseRepository} from './BaseDatabaseRepository';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ApiKeyRepository extends BaseDatabaseRepository
{
    /**
     * Constructor.
     *
     * @param {Database} client The database client
     */
    constructor(client: Database) {
        super(client, 'api-keys');
    }

    /**
     * @inheritDoc
     */
    public static getName(): string {
        return 'ApiKey';
    }
}
