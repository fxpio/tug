/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {createApp} from '@server/app';
import {AssetManager} from '@server/assets/AssetManager';
import {AwsDynamoDbDatabase} from '@server/db/AwsDynamoDbDatabase';
import {Logger} from '@server/loggers/Logger';
import {BasicMockAuthBuilder} from '@server/middlewares/auth/builders/BasicMockAuthBuilder';
import {BasicMockAuth} from '@server/middlewares/auth/strategies/BasicMockAuth';
import {LocalMessageQueue} from '@server/queues/LocalMessageQueue';
import {LocalStorage} from '@server/storages/LocalStorage';
import {LooseObject} from '@server/utils/LooseObject';
import dotenv from 'dotenv';
import {Request, Response} from 'express';
import fs from 'fs-extra';
import http, {IncomingMessage} from 'http';
import {URL} from 'url';

dotenv.config();

const env = process.env;
const port = env.SERVER_PORT || 3000;
const debug = 'production' !== env.NODE_ENV;
const app = createApp({
    database: new AwsDynamoDbDatabase(env.AWS_DYNAMODB_TABLE as string, env.AWS_REGION as string, env.AWS_DYNAMODB_URL),
    storage: new LocalStorage('@server/var/storage'),
    queue: new LocalMessageQueue(),
    logger: new Logger(env.LOGGER_LEVEL, debug),
    basicAuthStrategy: new BasicMockAuth(env.AWS_ACCESS_KEY_ID as string, env.AWS_SECRET_ACCESS_KEY as string),
    basicAuthBuilder: new BasicMockAuthBuilder(env.AWS_ACCESS_KEY_ID as string, env.AWS_SECRET_ACCESS_KEY as string),
    debug: debug,
    fallbackAssets: function(req: Request, res: Response, next: Function) {
        let assetManager = req.app.get('asset-manager') as AssetManager;
        let asset = (new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)).pathname.replace(/^\//g, '');
        let realAsset = assetManager.get(asset);

        if (asset === realAsset) {
            let baseUrl = req.app.get('asset-base-url');
            if (undefined === baseUrl) {
                baseUrl = '';
                try {
                    let config = fs.readJsonSync(__dirname + '/server-config.json') as LooseObject;
                    baseUrl = config.assetBaseUrl ? config.assetBaseUrl : baseUrl;
                    req.app.set('asset-base-url', baseUrl);
                } catch (e) {}
            }

            realAsset = baseUrl + realAsset;
        }

        http.get(realAsset, function (assetRes: IncomingMessage) {
            if (200 === assetRes.statusCode) {
                for (let name of Object.keys(assetRes.headers)) {
                    res.setHeader(name, assetRes.headers[name] as string);
                }

                res.status(assetRes.statusCode as number);
                assetRes.pipe(res);
                return;
            }

            next();
        });
    }
});

app.listen(port);
console.info(`Listening on http://localhost:${port}`);
