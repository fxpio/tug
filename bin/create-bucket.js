#!/usr/bin/env node

/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const env = require('./utils/env').loadEnvs();
const program = require('commander');
const AWS = require('aws-sdk');
const utils = require('./utils/utils');

program
    .description('Create the S3 bucket')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(() => {
        console.info('Creation of the AWS S3 bucket is started...');
        let s3 = new AWS.S3({apiVersion: '2006-03-01', region: env['AWS_REGION']});

        return s3.createBucket({Bucket: env['AWS_S3_BUCKET_DEPLOY']}).promise();
    })
    .then(() => {
        console.info(`AWS S3 bucket "${env['AWS_S3_BUCKET_DEPLOY']}" was created with successfully in the "${env['AWS_REGION']}" region`);
    })
    .catch(utils.displayError);
