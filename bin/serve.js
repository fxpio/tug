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
const async = require('async');
const fs = require('fs-extra');
const unzip = require('unzip');
const AWS = require('aws-sdk');
const utils = require('./utils/utils');

const dynamodbUrl = 'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.zip';
const dynamodbLocalPath = './var/dynamodb';
const dynamodbLocalBinPath = dynamodbLocalPath + '/DynamoDBLocal.jar';
const dynamodbLocalZipPath = dynamodbLocalPath + '.zip';

program
    .description('Serve the Satis server in local')
    .option('-p, --port [port]', 'The port to run the local server', 3000)
    .option('-d, --dynamodb-port [port]', 'The port to run the local AWS DynamoDB server', null)
    .parse(process.argv)
;

let dynamodbPort = program.dynamodbPort || program.port + 1;

process.env.SERVER_PORT = program.port;
process.env.AWS_DYNAMODB_URL = 'http://localhost:' + dynamodbPort;
process.env.AWS_DYNAMODB_TABLE = process.env.AWS_STACK_NAME + '-Database';

utils.spawn('node bin/config -e')
    .then(async () => {
        try {
            await utils.spawn('java -version', {}, true, false);
        } catch (e) {
            throw new Error('Java runtime must be installed to run the AWS DynamoDB local server');
        }
    })
    .then(async () => {
        if (!fs.existsSync(dynamodbLocalBinPath)) {
            if (!fs.existsSync(dynamodbLocalZipPath)) {
                console.info('Downloading the local AWS DynamoDB server...');
                await utils.downloadFile(dynamodbUrl, dynamodbLocalZipPath);
            }

            console.info('Extracting the archive of the local AWS DynamoDB server...');
            await fs.createReadStream(dynamodbLocalZipPath).pipe(unzip.Extract({path: dynamodbLocalPath}));
            await fs.unlink(dynamodbLocalZipPath);
        }
    })
    .then(async () => {
        async.parallel([
            // start the DynamoDB local server
            async function () {
                await utils.spawn('java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port ' + dynamodbPort, {}, true, true, {
                    cwd: dynamodbLocalPath + '/'
                });
            },
            // create the table in DynamoDB
            async function () {
                let db = new AWS.DynamoDB({
                    apiVersion: '2012-08-10',
                    region: process.env.AWS_REGION,
                    endpoint: process.env.AWS_DYNAMODB_URL
                });

                try {
                    await db.describeTable({TableName: process.env.AWS_DYNAMODB_TABLE}).promise();
                } catch (e) {
                    console.info('Creation of the table in AWS DynamoDB...');
                    await db.createTable({
                        TableName: process.env.AWS_DYNAMODB_TABLE,
                        AttributeDefinitions: [
                            {AttributeName: 'id', AttributeType: 'S'},
                            {AttributeName: 'model', AttributeType: 'S'}
                        ],
                        KeySchema: [
                            {AttributeName: 'id', KeyType: 'HASH'}
                        ],
                        GlobalSecondaryIndexes: [
                            {
                                IndexName: 'model-index',
                                KeySchema: [
                                    {AttributeName: 'model', KeyType: 'HASH'}
                                ],
                                Projection: {
                                    ProjectionType: 'ALL'
                                },
                                ProvisionedThroughput: {
                                    ReadCapacityUnits: 1,
                                    WriteCapacityUnits: 1
                                }
                            }
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 1,
                            WriteCapacityUnits: 1
                        }
                    }).promise();
                }
            },
            // compile and start the express server
            async.apply(utils.spawn, 'webpack --watch')
        ], function (err) {
            if (err) {
                utils.displayError(err);
            }
        })
    })
    .catch(utils.displayError);
