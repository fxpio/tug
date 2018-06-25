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
    .description('Delete the AWS Cloud Formation stack')
    .parse(process.argv);

utils.exec('node bin/config -e', [], function () {
    utils.exec('aws cloudformation delete-stack --stack-name {AWS_CLOUD_FORMATION_STACK_NAME} --region {AWS_REGION}');
});
