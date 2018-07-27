/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import awsServerlessExpress from 'aws-serverless-express';
import app from './app';

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
    'text/xml'
];

const server = awsServerlessExpress.createServer(app, undefined, binaryMimeTypes);

export function handler(event: any, context: any): void {
    awsServerlessExpress.proxy(server, event, context);
}
