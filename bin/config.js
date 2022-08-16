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

const program = require('commander');
const {prompt} = require('inquirer');
const AWS = require('aws-sdk');
const utils = require('./utils/utils');

const ENV_PATH = './.env';
const ENV_DIST_PATH = './.env.dist';

let initialEnvs = utils.readEnvVariables(ENV_PATH);
let envs = utils.mergeVariables(utils.readEnvVariables(ENV_DIST_PATH), initialEnvs);

program
    .description('Configure your Tug')
    .option('--aws-profile <name>', 'The profile name of AWS shared file (to configure automatically the credentials)', envs['AWS_PROFILE'])
    .option('--aws-access-key-id <key>', 'Your AWS Access Key ID (required if AWS Shared Credentials File is not found)', envs['AWS_ACCESS_KEY_ID'])
    .option('--aws-secret-access-key <secret>', 'Your AWS Secret Access Key (required if AWS Shared Credentials File is not found)', envs['AWS_SECRET_ACCESS_KEY'])
    .option('--aws-region <name>', 'Your AWS Region (required if AWS Shared Config File is not found)', envs['AWS_REGION'])
    .option('--aws-s3-bucket-deploy <bucket>', 'Your AWS S3 bucket name where the code must be deployed', envs['AWS_S3_BUCKET_DEPLOY'])
    .option('--aws-stack-name <stack>', 'Your AWS Stack name', envs['AWS_STACK_NAME'])
    .option('--logger-level <level>', 'The level of logger (error, warn, info, verbose)', envs['LOGGER_LEVEL'])
    .option('--debug', 'Check if the debug mode is enabled', envs['DEBUG'] === '1')
    .option('--redirect-to-app', 'Check if root the url must be redirect to the path of the PWA', envs['REDIRECT_TO_APP'] === '1')
    .option('--app-base-path <uri>', 'The base path to serve the PWA', envs['APP_BASE_PATH'])
    .option('-e, --only-empty', 'Display only questions of empty options', false)
    .option('-n, --no-interaction', 'Do not ask any interactive question', false)
    .parse(process.argv)
;

envs = utils.mergeVariables(envs, {
    AWS_PROFILE: program.awsProfile,
    AWS_ACCESS_KEY_ID: program.awsAccessKeyId,
    AWS_SECRET_ACCESS_KEY: program.awsSecretAccessKey,
    AWS_REGION: program.awsRegion,
    AWS_S3_BUCKET_DEPLOY: program.awsS3BucketDeploy,
    AWS_STACK_NAME: program.awsStackName,
    LOGGER_LEVEL: program.loggerLevel,
    DEBUG: program.debug ? '1' : '0',
    REDIRECT_TO_APP: program.redirectToApp ? '1' : '0',
    APP_BASE_PATH: program.appBasePath,
});

let finishAction = function(envs) {
    let invalidOptions = [];

    for (let i = 0; i < program.options.length; ++i) {
        let optionName = program.options[i].long;

        if (!['--no-interaction', '--only-empty'].includes(optionName)) {
            let envName = optionName.substr(2).replace(/-/g, '_').toUpperCase();

            if (undefined === envs[envName] || null === envs[envName]) {
                invalidOptions.push(optionName);
            }
        }
    }

    if (invalidOptions.length > 0) {
        console.error('Error: The options below of the "config" command are required:');
        for (let m = 0; m < invalidOptions.length; ++m) {
            console.error('  - "' + invalidOptions[m] + '"');
        }
        process.exit(1);
    }

    let sameConfig = utils.isSameObject(initialEnvs, envs);

    if (!sameConfig) {
        utils.writeVariables(ENV_PATH, envs);
    }

    if (true !== program.onlyEmpty || (true === program.onlyEmpty && !sameConfig)) {
        console.info('Project is configured successfully');
    }
};

let availableRegions = null;
let getAvailableRegions = async function () {
    if (null === availableRegions) {
        availableRegions = [];
        let ec2 = new AWS.EC2({apiVersion: '2016-11-15', region: 'us-west-1', credentials: {accessKeyId: envs.AWS_ACCESS_KEY_ID, secretAccessKey: envs.AWS_SECRET_ACCESS_KEY}});
        let res = await ec2.describeRegions({}).promise().catch(utils.displayError);

        if (undefined !== res.Regions) {
            for (let i = 0; i < res.Regions.length; ++i) {
                availableRegions.push(res.Regions[i].RegionName);
            }
        }
    }

    return availableRegions;
};

if (program.interaction) {
    let questions = [
        {
            type : 'input',
            name : 'awsProfile',
            default: function () {
                return envs['AWS_PROFILE'];
            },
            message : 'Enter the profile name of the AWS shared file you want to use:',
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'AWS_PROFILE');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsAccessKeyId',
            default: function () {
                return envs['AWS_ACCESS_KEY_ID'];
            },
            message : 'Enter your AWS Access Key ID:',
            when: function (answers) {
                let answerEnvs = {'AWS_PROFILE': answers.awsProfile},
                    awsEnvs = utils.findAwsVariables(answerEnvs);
                envs = utils.mergeVariables(answerEnvs, awsEnvs, envs);

                return null === envs['AWS_ACCESS_KEY_ID'];
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsSecretAccessKey',
            default: function () {
                return envs['AWS_SECRET_ACCESS_KEY'];
            },
            message : 'Enter your AWS Secret Access Key:',
            when: function () {
                return null === envs['AWS_SECRET_ACCESS_KEY'];
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'list',
            name : 'awsRegion',
            default: function () {
                return envs['AWS_REGION'];
            },
            message : 'Enter your AWS Region:',
            choices: function() {
                return getAvailableRegions();
            },
            when: function (answers) {
                let answerEnvs = {
                    'AWS_PROFILE': answers.awsProfile,
                    'AWS_ACCESS_KEY_ID': answers.awsAccessKeyId,
                    'AWS_SECRET_ACCESS_KEY': answers.awsSecretAccessKey,
                };
                let awsEnvs = utils.findAwsVariables(answerEnvs);
                envs = utils.mergeVariables(answerEnvs, awsEnvs, envs);

                return utils.showOnlyEmptyOption(program, envs, 'AWS_REGION');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsS3BucketDeploy',
            default: function () {
                return envs['AWS_S3_BUCKET_DEPLOY'];
            },
            message : 'Enter your AWS S3 bucket name:',
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'AWS_S3_BUCKET_DEPLOY');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsStackName',
            default: function () {
                return envs['AWS_STACK_NAME'];
            },
            message : 'Enter your AWS Stack name:',
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'AWS_STACK_NAME');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'list',
            name : 'loggerLevel',
            default: function () {
                return envs['LOGGER_LEVEL'];
            },
            message : 'Enter the logger level:',
            choices: function() {
                return ['error', 'warn', 'info', 'verbose'];
            },
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'AWS_REGION');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'list',
            name : 'debug',
            default: function () {
                return '1' === envs['DEBUG'] ? 'yes' : 'no';
            },
            message : 'Enable the debug mode?',
            choices: function() {
                return [
                    'yes',
                    'no',
                ];
            },
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'DEBUG');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'list',
            name : 'redirectToApp',
            default: function () {
                return '1' === envs['REDIRECT_TO_APP'] ? 'yes' : 'no';
            },
            message : 'Redirect the root url to the path of the PWA?',
            choices: function() {
                return [
                    'yes',
                    'no',
                ];
            },
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'REDIRECT_TO_APP');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'appBasePath',
            default: function () {
                return envs['APP_BASE_PATH'];
            },
            message : 'Enter the base path of the PWA:',
            when: function () {
                return utils.showOnlyEmptyOption(program, envs, 'APP_BASE_PATH');
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
    ];

    prompt(questions).then(function (answers) {
        let debug = answers.debug;
        let redirectToApp = answers.redirectToApp;

        if (undefined !== answers.debug) {
            debug = ['1', 'yes'].includes(answers.debug) ? '1' : '0';
        }

        if (undefined !== answers.redirectToApp) {
            redirectToApp = ['1', 'yes'].includes(answers.redirectToApp) ? '1' : '0';
        }

        envs = utils.mergeVariables(envs, {
            AWS_PROFILE: utils.cleanVariable(answers.awsProfile),
            AWS_ACCESS_KEY_ID: utils.cleanVariable(answers.awsAccessKeyId),
            AWS_SECRET_ACCESS_KEY: utils.cleanVariable(answers.awsSecretAccessKey),
            AWS_REGION: utils.cleanVariable(answers.awsRegion),
            AWS_S3_BUCKET_DEPLOY: utils.cleanVariable(answers.awsS3BucketDeploy),
            AWS_STACK_NAME: utils.cleanVariable(answers.awsStackName),
            LOGGER_LEVEL: utils.cleanVariable(answers.loggerLevel),
            DEBUG: utils.cleanVariable(debug),
            REDIRECT_TO_APP: utils.cleanVariable(redirectToApp),
            APP_BASE_PATH: utils.cleanVariable(answers.appBasePath),
        });

        finishAction(envs);
    });
} else {
    finishAction(envs);
}
