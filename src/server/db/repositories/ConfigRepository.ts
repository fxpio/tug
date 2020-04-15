/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '@server/db/Database';
import {BaseDatabaseRepository} from '@server/db/repositories/BaseDatabaseRepository';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ConfigRepository extends BaseDatabaseRepository
{
    /**
     * Constructor.
     *
     * @param {Database} client The database client
     */
    constructor(client: Database) {
        super(client, 'config');
    }

    /**
     * @inheritDoc
     */
    public static getName(): string {
        return 'Config';
    }
}
