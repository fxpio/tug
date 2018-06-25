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
const utils = require('./utils/utils');

program
    .description('Delete the S3 bucket')
    .parse(process.argv);

utils.exec('node bin/config -e', [], function () {
    utils.exec('aws s3 rb s3://{AWS_S3_BUCKET} --region {AWS_REGION}');
});