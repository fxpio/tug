/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {createApp} from '@server/app';
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
    debug,
    fallbackAssets(req: Request, res: Response, next: Function) {
        let assetBaseUrl = req.app.get('asset-base-url');
        if (undefined === assetBaseUrl) {
            assetBaseUrl = '';
            try {
                const config = fs.readJsonSync(__dirname + '/remote-assets-config.json') as LooseObject;
                assetBaseUrl = config.assetBaseUrl ? config.assetBaseUrl : assetBaseUrl;
                req.app.set('asset-base-url', assetBaseUrl);
            } catch (e) {}
        }

        if (!assetBaseUrl) {
            next();

            return;
        }

        const path = '/' === req.path ? '/index.html' : req.path;

        http.get(assetBaseUrl + path, (assetRes: IncomingMessage) => {
            if (200 === assetRes.statusCode) {
                for (const name of Object.keys(assetRes.headers)) {
                    res.setHeader(name, assetRes.headers[name] as string);
                }

                res.status(assetRes.statusCode as number);
                assetRes.pipe(res);
                return;
            }

            next();
        });
    },
});

app.listen(port);
console.info(`Listening on http://localhost:${port}`);
