#!/usr/bin/env node

/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

require('dotenv').config();
const program = require('commander');
const AWS = require('aws-sdk');
const utils = require('./utils/utils');
const api = require('./utils/api');

program
    .description('Create or generate a API key')
    .option('--key [key]', 'Your API key, if empty a key will be generated')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']});
        let key = typeof program.key !== 'string' || '' === program.key ? api.generateKey() : key;

        await s3.putObject({Bucket: process.env['AWS_S3_BUCKET'], Key: 'api-keys/' + key + '/'}).promise();

        return key;
    })
    .then((res) => {
        console.log(`The API key "${res}" was created successfully`)
    })
    .catch(utils.displayError);
