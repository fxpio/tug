/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '@server/db/Database';
import {Logger} from '@server/loggers/Logger';
import {AuthBuilder} from '@server/middlewares/auth/builders/AuthBuilder';
import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {MessageQueue} from '@server/queues/MessageQueue';
import {DataStorage} from '@server/storages/DataStorage';
import express from 'express';
import {RequestHandlerParams} from 'express-serve-static-core';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface AppOptions {
    app?: express.Express;
    database: Database;
    storage: DataStorage;
    queue: MessageQueue;
    logger: Logger;
    basicAuthStrategy: AuthStrategy;
    basicAuthBuilder: AuthBuilder;
    redirectToApp: boolean;
    appBasePath: string;
    debug: boolean;
    fallbackAssets?: RequestHandlerParams;
}
