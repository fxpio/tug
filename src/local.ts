/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dotenv from 'dotenv';
import {LocalStorage} from './storages/LocalStorage';
import {LocalMessageQueue} from './queues/LocalMessageQueue';
import {Logger} from './loggers/Logger';
import {AwsDynamoDbDatabase} from './db/AwsDynamoDbDatabase';
import {BasicMockAuth} from './middlewares/auth/strategies/BasicMockAuth';
import {BasicMockAuthBuilder} from './middlewares/auth/builders/BasicMockAuthBuilder';
import {createApp} from './app';

dotenv.config();

const env = process.env;
const port = env.SERVER_PORT || 3000;
const debug = 'production' !== env.NODE_ENV;
const app = createApp({
    database: new AwsDynamoDbDatabase(env.AWS_DYNAMODB_TABLE as string, env.AWS_REGION as string, env.AWS_DYNAMODB_URL),
    storage: new LocalStorage('./var/storage'),
    queue: new LocalMessageQueue(),
    logger: new Logger(env.LOGGER_LEVEL, debug),
    basicAuthStrategy: new BasicMockAuth(env.AWS_ACCESS_KEY_ID as string, env.AWS_SECRET_ACCESS_KEY as string),
    basicAuthBuilder: new BasicMockAuthBuilder(env.AWS_ACCESS_KEY_ID as string, env.AWS_SECRET_ACCESS_KEY as string),
    assetManifestPath: './dist/assets/manifest.json',
    assetBaseUrl: 'dist/assets',
    debug: debug
});

app.listen(port);
console.info(`Listening on http://localhost:${port}`);
