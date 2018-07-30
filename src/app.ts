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
import {AppOptions} from '@app/AppOptions';
import {ConfigRepository} from '@app/db/repositories/ConfigRepository';
import {ApiKeyRepository} from '@app/db/repositories/ApiKeyRepository';
import {CodeRepositoryRepository} from '@app/db/repositories/CodeRepositoryRepository';
import {PackageRepository} from '@app/db/repositories/PackageRepository';
import {ConfigManager} from '@app/configs/ConfigManager';
import {RepositoryManager} from '@app/composer/repositories/RepositoryManager';
import {PackageManager} from '@app/composer/packages/PackageManager';
import {PackageBuilder} from '@app/composer/packages/PackageBuilder';
import {Cache} from '@app/caches/Cache';
import {AssetManager} from '@app/assets/AssetManager';
import {PolyglotTranslator} from '@app/translators/PolyglotTranslator';
import {RefreshPackagesReceiver} from '@app/receivers/RefreshPackagesReceiver';
import {RefreshPackageReceiver} from '@app/receivers/RefreshPackageReceiver';
import {DeletePackagesReceiver} from '@app/receivers/DeletePackagesReceiver';
import {DeletePackageReceiver} from '@app/receivers/DeletePackageReceiver';
import {BuildPackageVersionsReceiver} from '@app/receivers/BuildPackageVersionsReceiver';
import {packageRoutes} from '@app/routes/packageRoutes';
import {hookRoutes} from '@app/routes/hookRoutes';
import {securityRoutes} from '@app/routes/securityRoutes';
import {managerRoutes} from '@app/routes/managerRoutes';
import {uiRoutes} from '@app/routes/uiRoutes';
import {logErrors} from '@app/middlewares/logs';
import {
    convertJsonSyntaxError,
    convertRepositoryError,
    convertRouteNotFoundError,
    convertURIError,
    convertVcsDriverError,
    showError
} from '@app/middlewares/errors';
import {defineLocale} from '@app/middlewares/translators';
import translationEn from '@app/translations/en';
import translationFr from '@app/translations/fr';

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
        assetManifestPath = options.assetManifestPath,
        assetBaseUrl = options.assetBaseUrl,
        debug = options.debug;

    // add database repositories
    db.setRepository(ConfigRepository);
    db.setRepository(ApiKeyRepository);
    db.setRepository(CodeRepositoryRepository);
    db.setRepository(PackageRepository);

    let configManager = new ConfigManager(db.getRepository(ConfigRepository) as ConfigRepository),
        repoManager = new RepositoryManager(configManager, db.getRepository(CodeRepositoryRepository) as CodeRepositoryRepository, queue),
        packageManager = new PackageManager(repoManager, db.getRepository(PackageRepository) as PackageRepository, queue),
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
    queue.subscribe(new DeletePackagesReceiver(db.getRepository(PackageRepository) as PackageRepository, queue, logger));
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
    app.use('/assets/', express.static(assetBaseUrl));
    app.use('/', hookRoutes(express.Router({})));
    app.use('/', securityRoutes(express.Router({}), basicAuthStrategy));
    app.use('/manager/', managerRoutes(express.Router({}), basicAuthStrategy));
    app.use('/', uiRoutes(express.Router({})));
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
