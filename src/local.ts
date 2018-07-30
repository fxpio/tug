/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {createApp} from '@app/app';
import {AwsDynamoDbDatabase} from '@app/db/AwsDynamoDbDatabase';
import {Logger} from '@app/loggers/Logger';
import {BasicMockAuthBuilder} from '@app/middlewares/auth/builders/BasicMockAuthBuilder';
import {BasicMockAuth} from '@app/middlewares/auth/strategies/BasicMockAuth';
import {LocalMessageQueue} from '@app/queues/LocalMessageQueue';
import {LocalStorage} from '@app/storages/LocalStorage';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env;
const port = env.SERVER_PORT || 3000;
const debug = 'production' !== env.NODE_ENV;
const app = createApp({
    database: new AwsDynamoDbDatabase(env.AWS_DYNAMODB_TABLE as string, env.AWS_REGION as string, env.AWS_DYNAMODB_URL),
    storage: new LocalStorage('@app/var/storage'),
    queue: new LocalMessageQueue(),
    logger: new Logger(env.LOGGER_LEVEL, debug),
    basicAuthStrategy: new BasicMockAuth(env.AWS_ACCESS_KEY_ID as string, env.AWS_SECRET_ACCESS_KEY as string),
    basicAuthBuilder: new BasicMockAuthBuilder(env.AWS_ACCESS_KEY_ID as string, env.AWS_SECRET_ACCESS_KEY as string),
    assetManifestPath: 'dist/assets/manifest.json',
    assetBaseUrl: 'dist/assets',
    debug: debug
});

app.listen(port);
console.info(`Listening on http://localhost:${port}`);
