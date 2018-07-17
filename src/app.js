/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import AwsDynamoDbDatabase from './db/AwsDynamoDbDatabase';
import ConfigRepository from './db/repositories/ConfigRepository';
import ApiKeyRepository from './db/repositories/ApiKeyRepository';
import CodeRepositoryRepository from './db/repositories/CodeRepositoryRepository';
import PackageRepository from './db/repositories/PackageRepository';
import ConfigManager from './configs/ConfigManager';
import RepositoryManager from './composer/repositories/RepositoryManager';
import PackageManager from './composer/packages/PackageManager';
import PackageBuilder from './composer/packages/PackageBuilder';
import LocalStorage from './storages/LocalStorage';
import AwsS3Storage from './storages/AwsS3Storage';
import Cache from './caches/Cache';
import LocalMessageQueue from './queues/LocalMessageQueue';
import AwsSqsMessageQueue from './queues/AwsSqsMessageQueue';
import RefreshPackagesReceiver from './receivers/RefreshPackagesReceiver';
import RefreshPackageReceiver from './receivers/RefreshPackageReceiver';
import {logErrors} from './middlewares/logs';
import {convertJsonSyntaxError, convertRouteNotFound, convertURIError, showError} from './middlewares/errors';
import {isProd} from './utils/server';
import packageRoutes from './routes/packageRoutes';
import hookRoutes from './routes/hookRoutes';
import managerRoutes from './routes/managerRoutes';
import BuildPackageVersionsReceiver from "./receivers/BuildPackageVersionsReceiver";

const app = express();
let storage,
    queue;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

if (isProd()) {
    app.use(compression());
    app.use(awsServerlessExpressMiddleware.eventContext());
    storage = new AwsS3Storage(process.env.AWS_S3_BUCKET, process.env.AWS_REGION);
    queue = new AwsSqsMessageQueue(process.env.AWS_SQS_QUEUE_URL);
} else {
    storage = new LocalStorage('./var/storage');
    queue = new LocalMessageQueue();
}

let db = new AwsDynamoDbDatabase(process.env.AWS_DYNAMODB_TABLE, process.env.AWS_REGION, process.env.AWS_DYNAMODB_URL);
db.setRepository(ConfigRepository);
db.setRepository(ApiKeyRepository);
db.setRepository(CodeRepositoryRepository);
db.setRepository(PackageRepository);

let configManager = new ConfigManager(db.getRepository(ConfigRepository));
let repoManager = new RepositoryManager(configManager, db.getRepository(CodeRepositoryRepository), queue);
let packageManager = new PackageManager(repoManager, db.getRepository(PackageRepository), queue);
let cache = new Cache(storage);
let packageBuilder = new PackageBuilder(repoManager, packageManager, cache);

queue.subscribe(new RefreshPackagesReceiver(repoManager, queue));
queue.subscribe(new RefreshPackageReceiver(repoManager, packageManager, queue));
queue.subscribe(new BuildPackageVersionsReceiver(packageBuilder));

app.set('config-manager', configManager);
app.set('repository-manager', repoManager);
app.set('package-manager', packageManager);
app.set('package-builder', packageBuilder);
app.set('db', db);
app.set('storage', storage);
app.set('cache', cache);
app.set('queue', queue);
app.use('/', hookRoutes(express.Router({})));
app.use('/manager/', managerRoutes(express.Router({})));
app.use('/', packageRoutes(express.Router({})));
app.use(convertURIError);
app.use(convertJsonSyntaxError);
app.use(convertRouteNotFound);
app.use(logErrors);
app.use(showError);

export default app;
