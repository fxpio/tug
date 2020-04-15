/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AppOptions} from '@server/AppOptions';
import {AssetManager} from '@server/assets/AssetManager';
import {Cache} from '@server/caches/Cache';
import {PackageBuilder} from '@server/composer/packages/PackageBuilder';
import {PackageManager} from '@server/composer/packages/PackageManager';
import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {ConfigManager} from '@server/configs/ConfigManager';
import {ApiKeyRepository} from '@server/db/repositories/ApiKeyRepository';
import {CodeRepositoryRepository} from '@server/db/repositories/CodeRepositoryRepository';
import {ConfigRepository} from '@server/db/repositories/ConfigRepository';
import {PackageRepository} from '@server/db/repositories/PackageRepository';
import {
    convertJsonSyntaxError,
    convertProvisionedThroughputExceededError,
    convertRepositoryError,
    convertRouteNotFoundError,
    convertURIError,
    convertVcsDriverError,
    showError,
} from '@server/middlewares/errors';
import {logErrors} from '@server/middlewares/logs';
import {defineLocale} from '@server/middlewares/translators';
import {BuildPackageVersionsReceiver} from '@server/receivers/BuildPackageVersionsReceiver';
import {DeletePackageReceiver} from '@server/receivers/DeletePackageReceiver';
import {DeletePackagesReceiver} from '@server/receivers/DeletePackagesReceiver';
import {RefreshPackageReceiver} from '@server/receivers/RefreshPackageReceiver';
import {RefreshPackagesReceiver} from '@server/receivers/RefreshPackagesReceiver';
import {hookRoutes} from '@server/routes/hookRoutes';
import {managerRoutes} from '@server/routes/managerRoutes';
import {packageRoutes} from '@server/routes/packageRoutes';
import {securityRoutes} from '@server/routes/securityRoutes';
import {uiRoutes} from '@server/routes/uiRoutes';
import translationEn from '@server/translations/en';
import translationFr from '@server/translations/fr';
import {PolyglotTranslator} from '@server/translators/PolyglotTranslator';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';

/**
 * Create the app server.
 *
 * @param {AppOptions} options The application options
 *
 * @return {express}
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createApp(options: AppOptions): express.Express {
    const app = options.app ? options.app : express(),
        db = options.database,
        storage = options.storage,
        queue = options.queue,
        logger = options.logger,
        basicAuthStrategy = options.basicAuthStrategy,
        basicAuthBuilder = options.basicAuthBuilder,
        fallbackAssets = options.fallbackAssets,
        assetManifestPath = path.resolve(__dirname, 'admin/assets-manifest.json'),
        debug = options.debug;

    // add database repositories
    db.setRepository(ConfigRepository);
    db.setRepository(ApiKeyRepository);
    db.setRepository(CodeRepositoryRepository);
    db.setRepository(PackageRepository);

    const configManager = new ConfigManager(db.getRepository<ConfigRepository>(ConfigRepository)),
        repoManager = new RepositoryManager(configManager, db.getRepository<CodeRepositoryRepository>(CodeRepositoryRepository), queue),
        packageManager = new PackageManager(repoManager, db.getRepository<PackageRepository>(PackageRepository), queue),
        cache = new Cache(storage),
        packageBuilder = new PackageBuilder(repoManager, packageManager, cache),
        assetManager = new AssetManager(assetManifestPath, debug),
        translator = new PolyglotTranslator('en');

    // add translations
    translator.addTranslation('en', translationEn);
    translator.addTranslation('fr', translationFr);

    // add message queue receivers
    queue.subscribe(new RefreshPackagesReceiver(repoManager, queue, logger));
    queue.subscribe(new RefreshPackageReceiver(repoManager, packageManager, queue, logger));
    queue.subscribe(new DeletePackagesReceiver(db.getRepository<PackageRepository>(PackageRepository), queue, logger));
    queue.subscribe(new DeletePackageReceiver(packageManager, queue, logger));
    queue.subscribe(new BuildPackageVersionsReceiver(packageBuilder, queue, logger));

    // define services
    app.disable('etag');
    app.set('debug', debug);
    app.set('logger', logger);
    app.set('basic-auth-builder', basicAuthBuilder);
    app.set('config-manager', configManager);
    app.set('repository-manager', repoManager);
    app.set('package-manager', packageManager);
    app.set('package-builder', packageBuilder);
    app.set('db', db);
    app.set('storage', storage);
    app.set('cache', cache);
    app.set('queue', queue);
    app.set('asset-manager', assetManager);
    app.set('translator', translator);

    // enable middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(defineLocale);

    // defines routes
    app.use('/', hookRoutes(express.Router({})));
    app.use('/', securityRoutes(express.Router({}), basicAuthStrategy));
    app.use('/manager/', managerRoutes(express.Router({}), basicAuthStrategy));
    app.use('/', uiRoutes(express.Router({}), fallbackAssets));
    app.use('/', packageRoutes(express.Router({})));

    // enable error and logger middlewares in end
    app.use(convertProvisionedThroughputExceededError);
    app.use(convertURIError);
    app.use(convertJsonSyntaxError);
    app.use(convertVcsDriverError);
    app.use(convertRepositoryError);
    app.use(convertRouteNotFoundError);
    app.use(logErrors);
    app.use(showError);

    return app;
}
