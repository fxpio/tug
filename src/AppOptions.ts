/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import express from 'express';
import {MessageQueue} from './queues/MessageQueue';
import {DataStorage} from './storages/DataStorage';
import {Logger} from './loggers/Logger';
import {Database} from './db/Database';
import {AuthStrategy} from './middlewares/auth/strategies/AuthStrategy';
import {AuthBuilder} from './middlewares/auth/builders/AuthBuilder';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface AppOptions
{
    app?: express.Express;
    database: Database;
    storage: DataStorage;
    queue: MessageQueue;
    logger: Logger;
    basicAuthStrategy: AuthStrategy,
    basicAuthBuilder: AuthBuilder,
    assetManifestPath: string,
    assetBaseUrl: string,
    debug: boolean;
}
