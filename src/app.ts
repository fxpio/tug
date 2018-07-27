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
import {Logger} from './loggers/Logger';
import {AwsDynamoDbDatabase} from './db/AwsDynamoDbDatabase';
import {ConfigRepository} from './db/repositories/ConfigRepository';
import {ApiKeyRepository} from './db/repositories/ApiKeyRepository';
import {CodeRepositoryRepository} from './db/repositories/CodeRepositoryRepository';
import {PackageRepository} from './db/repositories/PackageRepository';
import {ConfigManager} from './configs/ConfigManager';
import {RepositoryManager} from './composer/repositories/RepositoryManager';
import {PackageManager} from './composer/packages/PackageManager';
import {PackageBuilder} from './composer/packages/PackageBuilder';
import {LocalStorage} from './storages/LocalStorage';
import {AwsS3Storage} from './storages/AwsS3Storage';
import {Cache} from './caches/Cache';
import {AssetManager} from './assets/AssetManager';
import {LocalMessageQueue} from './queues/LocalMessageQueue';
import {AwsSqsMessageQueue} from './queues/AwsSqsMessageQueue';
import {RefreshPackagesReceiver} from './receivers/RefreshPackagesReceiver';
import {RefreshPackageReceiver} from './receivers/RefreshPackageReceiver';
import {DeletePackagesReceiver} from './receivers/DeletePackagesReceiver';
import {DeletePackageReceiver} from './receivers/DeletePackageReceiver';
import {BuildPackageVersionsReceiver} from './receivers/BuildPackageVersionsReceiver';
import {packageRoutes} from './routes/packageRoutes';
import {hookRoutes} from './routes/hookRoutes';
import {securityRoutes} from './routes/securityRoutes';
import {managerRoutes} from './routes/managerRoutes';
import {uiRoutes} from './routes/uiRoutes';
import {logErrors} from './middlewares/logs';
import {
    convertJsonSyntaxError,
    convertRepositoryError,
    convertRouteNotFound,
    convertURIError,
    convertVcsDriverError,
    showError
} from './middlewares/errors';
import {isProd} from './utils/server';

const app = express();
let storage,
    queue;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (isProd()) {
    app.use(compression());
    app.use(awsServerlessExpressMiddleware.eventContext());
    storage = new AwsS3Storage(process.env.AWS_S3_BUCKET as string, process.env.AWS_REGION as string);
    queue = new AwsSqsMessageQueue(process.env.AWS_SQS_QUEUE_URL as string);
} else {
    storage = new LocalStorage('./var/storage');
    queue = new LocalMessageQueue();
}

let logger = new Logger(process.env.LOGGER_LEVEL);
let db = new AwsDynamoDbDatabase(process.env.AWS_DYNAMODB_TABLE as string, process.env.AWS_REGION as string, process.env.AWS_DYNAMODB_URL);
db.setRepository(ConfigRepository);
db.setRepository(ApiKeyRepository);
db.setRepository(CodeRepositoryRepository);
db.setRepository(PackageRepository);

let configManager = new ConfigManager(db.getRepository(ConfigRepository) as ConfigRepository);
let repoManager = new RepositoryManager(configManager, db.getRepository(CodeRepositoryRepository) as CodeRepositoryRepository, queue);
let packageManager = new PackageManager(repoManager, db.getRepository(PackageRepository) as PackageRepository, queue);
let cache = new Cache(storage);
let packageBuilder = new PackageBuilder(repoManager, packageManager, cache);
let assetManager = new AssetManager(isProd() ? './assets/manifest.json' : './dist/assets/manifest.json', !isProd());

queue.subscribe(new RefreshPackagesReceiver(repoManager, queue, logger));
queue.subscribe(new RefreshPackageReceiver(repoManager, packageManager, queue, logger));
queue.subscribe(new DeletePackagesReceiver(db.getRepository(PackageRepository) as PackageRepository, queue, logger));
queue.subscribe(new DeletePackageReceiver(packageManager, queue, logger));
queue.subscribe(new BuildPackageVersionsReceiver(packageBuilder, logger));

app.disable('etag');
app.set('logger', logger);
app.set('config-manager', configManager);
app.set('repository-manager', repoManager);
app.set('package-manager', packageManager);
app.set('package-builder', packageBuilder);
app.set('db', db);
app.set('storage', storage);
app.set('cache', cache);
app.set('queue', queue);
app.set('asset-manager', assetManager);
app.use('/assets/', express.static(isProd() ? 'assets' : 'dist/assets'));
app.use('/', hookRoutes(express.Router({})));
app.use('/', securityRoutes(express.Router({})));
app.use('/manager/', managerRoutes(express.Router({})));
app.use('/', uiRoutes(express.Router({})));
app.use('/', packageRoutes(express.Router({})));
app.use(convertURIError);
app.use(convertJsonSyntaxError);
app.use(convertVcsDriverError);
app.use(convertRepositoryError);
app.use(convertRouteNotFound);
app.use(logErrors);
app.use(showError);

export default app;
