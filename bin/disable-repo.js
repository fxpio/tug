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
const AWS = require('aws-sdk');
const utils = require('./utils/utils');
const api = require('./utils/api');

program
    .description('Disable the Github repository')
    .option('-r, --repository [name]', 'The repository name (<username-organization>/<repository>)')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']});
        let repo = program.repository;

        if (typeof repo !== 'string' || '' === repo) {
            throw new Error('The "--repository" option is required');
        }

        if (!repo.match(/\//)) {
            throw new Error('The repository name must be formated with "<username-or-organization-name>/<repository-name>"');
        }

        await s3.deleteObject({Bucket: process.env['AWS_S3_BUCKET'], Key: 'repositories/' + repo + '/'}).promise();

        return repo;
    })
    .then((res) => {
        console.log(`The repository "${res}" were disabled successfully`)
    })
    .catch(utils.displayError);
