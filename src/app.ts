/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AppOptions} from '@app/AppOptions';
import {AssetManager} from '@app/assets/AssetManager';
import {Cache} from '@app/caches/Cache';
import {PackageBuilder} from '@app/composer/packages/PackageBuilder';
import {PackageManager} from '@app/composer/packages/PackageManager';
import {RepositoryManager} from '@app/composer/repositories/RepositoryManager';
import {ConfigManager} from '@app/configs/ConfigManager';
import {ApiKeyRepository} from '@app/db/repositories/ApiKeyRepository';
import {CodeRepositoryRepository} from '@app/db/repositories/CodeRepositoryRepository';
import {ConfigRepository} from '@app/db/repositories/ConfigRepository';
import {PackageRepository} from '@app/db/repositories/PackageRepository';
import {
    convertJsonSyntaxError,
    convertRepositoryError,
    convertRouteNotFoundError,
    convertURIError,
    convertVcsDriverError,
    showError
} from '@app/middlewares/errors';
import {logErrors} from '@app/middlewares/logs';
import {defineLocale} from '@app/middlewares/translators';
import {BuildPackageVersionsReceiver} from '@app/receivers/BuildPackageVersionsReceiver';
import {DeletePackageReceiver} from '@app/receivers/DeletePackageReceiver';
import {DeletePackagesReceiver} from '@app/receivers/DeletePackagesReceiver';
import {RefreshPackageReceiver} from '@app/receivers/RefreshPackageReceiver';
import {RefreshPackagesReceiver} from '@app/receivers/RefreshPackagesReceiver';
import {hookRoutes} from '@app/routes/hookRoutes';
import {managerRoutes} from '@app/routes/managerRoutes';
import {packageRoutes} from '@app/routes/packageRoutes';
import {securityRoutes} from '@app/routes/securityRoutes';
import {uiRoutes} from '@app/routes/uiRoutes';
import translationEn from '@app/translations/en';
import translationFr from '@app/translations/fr';
import {PolyglotTranslator} from '@app/translators/PolyglotTranslator';
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
    let app = options.app ? options.app : express(),
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

    let configManager = new ConfigManager(db.getRepository<ConfigRepository>(ConfigRepository)),
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
    queue.subscribe(new BuildPackageVersionsReceiver(packageBuilder, logger));

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
    app.use(convertURIError);
    app.use(convertJsonSyntaxError);
    app.use(convertVcsDriverError);
    app.use(convertRepositoryError);
    app.use(convertRouteNotFoundError);
    app.use(logErrors);
    app.use(showError);

    return app;
}
