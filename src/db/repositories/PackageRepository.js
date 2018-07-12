/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Database from '../Database';
import DatabaseRepository from './DatabaseRepository';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class PackageRepository extends DatabaseRepository
{
    /**
     * Constructor.
     *
     * @param {Database} client The database client
     */
    constructor(client) {
        super(client, 'packages');
    }

    /**
     * @inheritDoc
     */
    static getName() {
        return 'Package';
    }
};
