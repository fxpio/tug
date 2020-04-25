/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {createApp} from '@server/app';
import {AwsDynamoDbDatabase} from '@server/db/AwsDynamoDbDatabase';
import {Logger} from '@server/loggers/Logger';
import {BasicIamAuthBuilder} from '@server/middlewares/auth/builders/BasicIamAuthBuilder';
import {BasicIamAuth} from '@server/middlewares/auth/strategies/BasicIamAuth';
import {AwsSqsMessageQueue} from '@server/queues/AwsSqsMessageQueue';
import {AwsS3Storage} from '@server/storages/AwsS3Storage';
import awsServerlessExpress from 'aws-serverless-express';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import compression from 'compression';
import express from 'express';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
const binaryMimeTypes = [
    'application/font-sfnt',
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/vnd.ms-fontobject',
    'application/x-font-opentype',
    'application/x-font-truetype',
    'application/xml',
    'application/font-woff',
    'application/font-woff2',
    'font/eot',
    'font/opentype',
    'font/otf',
    'font/ttf',
    'font/woff',
    'font/woff2',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/x-icon',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml',
];

const app = express();
const env = process.env;
const debug = '1' === env.DEBUG;
const redirectToApp = '1' === env.REDIRECT_TO_APP;
const appBasePath = env.APP_BASE_PATH ? env.APP_BASE_PATH : '';

app.use(compression());
app.use(awsServerlessExpressMiddleware.eventContext());

createApp({
    app,
    database: new AwsDynamoDbDatabase(env.AWS_DYNAMODB_TABLE as string, env.AWS_REGION as string, env.AWS_DYNAMODB_URL),
    storage: new AwsS3Storage(env.AWS_S3_BUCKET as string, env.AWS_REGION as string),
    queue: new AwsSqsMessageQueue(env.AWS_SQS_QUEUE_URL as string),
    logger: new Logger(env.LOGGER_LEVEL, debug),
    basicAuthStrategy: new BasicIamAuth(env.AWS_ACCOUNT_ID),
    basicAuthBuilder: new BasicIamAuthBuilder(),
    redirectToApp,
    appBasePath,
    debug,
});

const server = awsServerlessExpress.createServer(app, undefined, binaryMimeTypes);

export function handler(event: any, context: any): void {
    app.set('request-context-path', event.requestContext.path);
    awsServerlessExpress.proxy(server, event, context);
}
