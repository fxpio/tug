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

program
    .description('Delete the S3 bucket')
    .parse(process.argv);

utils.exec('node bin/config -e', [], function () {
    console.info('Deletion of the S3 bucket is started...');

    let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']});
    s3.deleteBucket({Bucket: process.env['AWS_S3_BUCKET']}).promise().then(() => {
        console.log(`AWS S3 bucket "${process.env['AWS_S3_BUCKET']}" was deleted with successfully`);
    }).catch(utils.displayError);
});
