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

const program = require('commander');
const {prompt} = require('inquirer');
const utils = require('./utils/utils');

const ENV_PATH = './.env';
const ENV_DIST_PATH = './.env.dist';

let envs = utils.mergeVariables(utils.readEnvVariables(ENV_DIST_PATH), utils.readEnvVariables(ENV_PATH));

program
    .description('Configure your Satis Serverless')
    .option('--aws-profile [name]', 'The profile name of AWS CLI configuration (to configure automatically the credentials)', envs['AWS_PROFILE'])
    .option('--aws-account-id [id]', 'Your AWS Account ID (required for Cloud Formation)', envs['AWS_ACCOUNT_ID'])
    .option('--aws-access-key-id [key]', 'Your AWS Access Key ID (required if AWS CLI profile is not found)', envs['AWS_ACCESS_KEY_ID'])
    .option('--aws-secret-access-key [secret]', 'Your AWS Secret Access Key (required if AWS CLI profile is not found)', envs['AWS_SECRET_ACCESS_KEY'])
    .option('--aws-region [name]', 'Your AWS Region (required if AWS CLI profile is not found)', envs['AWS_REGION'])
    .option('--aws-s3-bucket [bucket]', 'Your AWS S3 bucket name', envs['AWS_S3_BUCKET'])
    .option('--aws-cloud-formation-stack-name [stack]', 'Your AWS Cloud Formation Stack name', envs['AWS_CLOUD_FORMATION_STACK_NAME'])
    .option('--aws-lambda-function-name [function]', 'Your AWS Lambda Function name', envs['AWS_LAMBDA_FUNCTION_NAME'])
    .option('--github-token [token]', 'Your Github token', envs['GITHUB_TOKEN'])
    .option('-e, --only-empty', 'Display only questions of empty options', false)
    .option('-n, --no-interaction', 'Do not ask any interactive question', false)
    .parse(process.argv)
;

envs = utils.mergeVariables(envs, {
    AWS_PROFILE: program.awsProfile,
    AWS_ACCOUNT_ID: program.awsAccountId,
    AWS_ACCESS_KEY_ID: program.awsAccessKeyId,
    AWS_SECRET_ACCESS_KEY: program.awsSecretAccessKey,
    AWS_REGION: program.awsRegion,
    AWS_S3_BUCKET: program.awsS3Bucket,
    AWS_CLOUD_FORMATION_STACK_NAME: program.awsCloudFormationStackName,
    AWS_LAMBDA_FUNCTION_NAME: program.awsLambdaFunctionName,
    GITHUB_TOKEN: program.githubToken
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

    utils.writeVariables(ENV_PATH, envs);

    console.info('Project is configured successfully');
};

if (program.interaction) {
    let questions = [
        {
            type : 'input',
            name : 'awsProfile',
            default: envs['AWS_PROFILE'],
            message : 'Enter the AWS CLI profile name you want to use:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['AWS_PROFILE']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsAccessKeyId',
            default: envs['AWS_ACCESS_KEY_ID'],
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
            default: envs['AWS_SECRET_ACCESS_KEY'],
            message : 'Enter your AWS Secret Access Key:',
            when: function () {
                return null === envs['AWS_SECRET_ACCESS_KEY'];
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsRegion',
            default: envs['AWS_REGION'],
            message : 'Enter your AWS Region:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['AWS_REGION']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsAccountId',
            default: envs['AWS_ACCOUNT_ID'],
            message : 'Enter your AWS Account ID:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['AWS_ACCOUNT_ID']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsS3Bucket',
            default: envs['AWS_S3_BUCKET'],
            message : 'Enter your AWS S3 bucket name:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['AWS_S3_BUCKET']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsCloudFormationStackName',
            default: envs['AWS_CLOUD_FORMATION_STACK_NAME'],
            message : 'Enter your AWS Cloud Formation Stack name:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['AWS_CLOUD_FORMATION_STACK_NAME']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'awsLambdaFunctionName',
            default: envs['AWS_LAMBDA_FUNCTION_NAME'],
            message : 'Enter your AWS Lambda Function name:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['AWS_LAMBDA_FUNCTION_NAME']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        },
        {
            type : 'input',
            name : 'githubToken',
            default: envs['GITHUB_TOKEN'],
            message : 'Enter your Github token:',
            when: function () {
                return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs['GITHUB_TOKEN']);
            },
            validate: function (value) {
                return utils.requiredOption(value);
            }
        }
    ];

    prompt(questions).then(function (answers) {
        envs = utils.mergeVariables(envs, {
            AWS_PROFILE: utils.cleanVariable(answers.awsProfile),
            AWS_ACCOUNT_ID: utils.cleanVariable(answers.awsAccountId),
            AWS_ACCESS_KEY_ID: utils.cleanVariable(answers.awsAccessKeyId),
            AWS_SECRET_ACCESS_KEY: utils.cleanVariable(answers.awsSecretAccessKey),
            AWS_REGION: utils.cleanVariable(answers.awsRegion),
            AWS_S3_BUCKET: utils.cleanVariable(answers.awsS3Bucket),
            AWS_CLOUD_FORMATION_STACK_NAME: utils.cleanVariable(answers.awsCloudFormationStackName),
            AWS_LAMBDA_FUNCTION_NAME: utils.cleanVariable(answers.awsLambdaFunctionName),
            GITHUB_TOKEN: utils.cleanVariable(answers.githubToken)
        });

        finishAction(envs);
    });
} else {
    finishAction(envs);
}
