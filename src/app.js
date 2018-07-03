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
import {basicAuth} from './middleware/auth/basic-api';

const app = express();
const router = express.Router({});

if ('production' === process.env.NODE_ENV) {
    app.use(compression());
    app.use(awsServerlessExpressMiddleware.eventContext());
}

router.use(basicAuth);
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.json({message: 'Hello world!'});
    //res.json(req.apiGateway.event);
});

router.post('/hooks', (req, res) => {
    res.json({message: 'Hello world!'});
    //res.json(req.apiGateway.event);
});

app.use('/', router);

export default app;
