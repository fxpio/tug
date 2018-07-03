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
const fs = require('fs');
const program = require('commander');
const AWS = require('aws-sdk');
const utils = require('./utils/utils');

const DEPLOY_PATH = './deploy';
const DEPLOY_CLOUDFORMATION_PATH = DEPLOY_PATH + '/package-stack.yaml';

program
    .description('Deploy the packaged project in AWS Cloud Formation')
    .parse(process.argv);

let stackName = process.env['AWS_STACK_NAME'];
let cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region: process.env['AWS_REGION']});

let createAction = function(action) {
    let changeName = stackName + '-' + utils.generateId(12);
    let params = {
        ChangeSetName: changeName,
        StackName: stackName,
        ChangeSetType: action.toUpperCase(),
        Capabilities: ['CAPABILITY_IAM'],
        TemplateBody: fs.readFileSync(DEPLOY_CLOUDFORMATION_PATH, 'utf8')
    };

    cf.createChangeSet(params).promise()
        .then((res) => {
            return new Promise(function(resolve, reject) {
                utils.retryPromise((done, retry) => {
                   cf.describeChangeSet({ChangeSetName: res.Id}).promise()
                       .then((resDesc) => {
                           if ('CREATE_COMPLETE' === resDesc.Status) {
                               cf.executeChangeSet({ChangeSetName: changeName, StackName: stackName}).promise()
                                   .then(() => {
                                       console.info(`AWS Cloud Formation stack "${process.env['AWS_STACK_NAME']}" was queued for the ${'UPDATE' === action ? 'update' : 'creation'} with successfully`);
                                       done();
                                       resolve();
                                   }).catch(reject);
                            } else if ('CREATE_IN_PROGRESS' === resDesc.Status) {
                                retry(2000);
                            } else {
                                console.info(`Deployment is "${resDesc.Status}" because "${resDesc.StatusReason}"`);
                            }
                       })
                       .catch((e) => {
                           if ('CREATE_PENDING' === e.Status) {
                               retry(2000);
                           } else {
                               reject(e);
                           }
                       });
                });
            });
        })
        .catch(utils.displayError);
};

console.info('Deployment of the project has started...');

cf.describeStacks({StackName: stackName}).promise()
    .then(() => createAction('UPDATE'))
    .catch((e) => {
        if ('ValidationError' === e.code) {
            createAction('CREATE');
        } else {
            utils.displayError(e);
        }
    });
