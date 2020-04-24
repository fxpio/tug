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
    .description('Delete the AWS Cloud Formation stack')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(() => {
        console.info('Deletion of the AWS Cloud Formation stack is started...');
        let cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region: env['AWS_REGION']});

        return cf.deleteStack({StackName: env['AWS_STACK_NAME']}).promise();
    })
    .then(() => {
        console.info(`AWS Cloud Formation stack "${env['AWS_STACK_NAME']}" was queued for the deletion with successfully`);
    })
    .catch(utils.displayError);
