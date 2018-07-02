/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const authBasic = require('./auth/basic-api');

const app = express();
const router = express.Router({});

app.use(authBasic);

if ('production' === process.env.NODE_ENV) {
    app.use(compression());
    app.use(awsServerlessExpressMiddleware.eventContext());
}

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

module.exports = app;
