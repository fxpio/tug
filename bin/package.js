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
    .description('Package the built project in S3 for AWS Cloud Formation (build the project before)')
    .parse(process.argv);

utils.exec('node bin/config -n', {}, function () {
    utils.exec('node bin/build', {}, function () {
        utils.exec('aws cloudformation package --template ./dist/cloudformation.yaml --s3-bucket {AWS_S3_BUCKET} --output-template packaged-sam.yaml --region {AWS_REGION}');
    });
});
