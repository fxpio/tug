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
const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const AWS = require('aws-sdk');
const archiver = require('./utils/archiver');
const utils = require('./utils/utils');

const CONTENT_PATH = './dist';
const CONTENT_SWAGGER_PATH = CONTENT_PATH + '/api-gateway-proxy-swagger.yaml';
const CONTENT_CLOUDFORMATION_PATH = CONTENT_PATH + '/cloud-formation-stack.yaml';
const DEPLOY_PATH = './deploy';
const DEPLOY_ARCHIVE_PATH = DEPLOY_PATH + '/package-lambda.zip';
const DEPLOY_SWAGGER_PATH = DEPLOY_PATH + '/swagger-api-gateway.yaml';
const DEPLOY_CLOUDFORMATION_PATH = DEPLOY_PATH + '/package-stack.yaml';

let s3Keys = {};

program
    .description('Package the built project in S3 for AWS Cloud Formation (build the project before)')
    .option('-f, --force', 'Force to rebuild the project', false)
    .option('--force-package', 'Force to rebuild the package only', false)
    .parse(process.argv);

utils.exec('node bin/build' + (program.force ? ' --force' : ''), [], function () {
    console.info('Packaging of the project has started...');

    if (!program.forcePackage && !program.force && fs.existsSync(DEPLOY_PATH)) {
        console.info('Project is already packaged. Use the "--force" or "--force-package" options to repackage the project');
        return;
    }

    (new Promise((resolve, reject) => {
        try {
            utils.removeDir(DEPLOY_PATH);
            resolve();
        } catch (e) {
            reject(e);
        }
    }))
        // Swagger API file
        .then(() => {
            fs.copySync(CONTENT_SWAGGER_PATH, DEPLOY_SWAGGER_PATH);

            return DEPLOY_SWAGGER_PATH;
        })
        .then((swaggerPath) => utils.checksumFile(swaggerPath))
        .then((hash) => {
            let newPath = path.join(path.dirname(DEPLOY_SWAGGER_PATH), hash);
            fs.renameSync(DEPLOY_SWAGGER_PATH, newPath);

            return newPath;
        })
        .then((filePath) => {
            let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']});
            let fileStream = fs.createReadStream(filePath);
            let params = {
                Bucket: process.env['AWS_S3_BUCKET'],
                Body: fileStream,
                Key: utils.fixWinSlash(filePath)
            };

            fileStream.on('error', utils.displayError);

            return s3.upload(params).promise();
        })
        .then((data) => {
            s3Keys['S3_SWAGGER_YAML_KEY'] = data.Key;
        })

        // Lambda package
        .then(() => archiver.archive(CONTENT_PATH, DEPLOY_ARCHIVE_PATH))
        .then((archivePath) => utils.checksumFile(archivePath))
        .then((hash) => {
            let newPath = path.join(path.dirname(DEPLOY_ARCHIVE_PATH), hash);
            fs.renameSync(DEPLOY_ARCHIVE_PATH, newPath);

            return newPath;
        })
        .then((filePath) => {
            let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']});
            let fileStream = fs.createReadStream(filePath);
            let params = {
                Bucket: process.env['AWS_S3_BUCKET'],
                Body: fileStream,
                Key: utils.fixWinSlash(filePath)
            };

            fileStream.on('error', utils.displayError);

            return s3.upload(params).promise();
        })
        .then((data) => {
            s3Keys['S3_LAMBDA_PACKAGE_ZIP_KEY'] = data.Key;
        })

        // Cloud Formation stack
        .then(() => {
            let data = fs.readFileSync(CONTENT_CLOUDFORMATION_PATH, 'utf8');
            data = utils.replaceVariables(data, s3Keys);

            fs.writeFileSync(DEPLOY_CLOUDFORMATION_PATH, data);

            console.info('Project is packaged successfully');
        })

        // Errors
        .catch(utils.displayError);
});
