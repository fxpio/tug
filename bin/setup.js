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
    .description('Configure the project, create the S3 bucket, package and deploy in AWS Cloud Formation, with API Gateway, Lambda and IAM')
    .parse(process.argv);

let deployCommand = function () {
    utils.exec('node bin/package-deploy');
};

utils.exec('node bin/config', [], function () {
    utils.exec('node bin/run aws s3api get-bucket-location --bucket {AWS_S3_BUCKET} --region {AWS_REGION}', [], function (code) {
        if (code > 0) {
            utils.exec('node bin/create-bucket', [], deployCommand);
        } else {
            deployCommand();
        }
    }, false, false);
});
