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
    .description('Delete a API key')
    .option('--key [key]', 'The API key')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']});
        let key = program.key;

        if (typeof key !== 'string' || '' === key) {
            throw new Error('The "--key" option with the api key value is required');
        }

        await s3.deleteObject({Bucket: process.env['AWS_S3_BUCKET'], Key: 'api-keys/' + key + '/'}).promise();

        return key;
    })
    .then((res) => {
        console.log(`The API key "${res}" was deleted successfully`)
    })
    .catch(utils.displayError);
