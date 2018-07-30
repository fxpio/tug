/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import express from 'express';
import {MessageQueue} from '@app/queues/MessageQueue';
import {DataStorage} from '@app/storages/DataStorage';
import {Logger} from '@app/loggers/Logger';
import {Database} from '@app/db/Database';
import {AuthStrategy} from '@app/middlewares/auth/strategies/AuthStrategy';
import {AuthBuilder} from '@app/middlewares/auth/builders/AuthBuilder';

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
