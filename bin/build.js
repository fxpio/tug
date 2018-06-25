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
const fse = require('fs-extra');
const utils = require('./utils/utils');
const {execSync} = require('child_process');

program
    .description('Build the project')
    .parse(process.argv);

// clean dist directory
fse.removeSync('./dist/');

// copy sources
fse.copySync('./src', './dist');

// copy dependencies
fse.copySync('./package.json', './dist/package.json');
fse.copySync('./yarn.lock', './dist/yarn.lock');
execSync('yarn install --prod', {
    cwd: './dist'
});
fse.removeSync('./dist/package.json');
fse.removeSync('./dist/yarn.lock');

// copy and configure the aws templates
let outputPath = './dist',
    files = ['./aws/simple-proxy-api.yaml', './aws/cloudformation.yaml'];

if (!fse.existsSync(outputPath)){
    fse.mkdirSync(outputPath);
}

files.forEach((file) => {
    let fileContentModified = utils.replaceVariables(fse.readFileSync(file, 'utf8'));
    fse.writeFileSync(outputPath + '/' + file.replace('./aws', ''), fileContentModified, 'utf8')
});

console.info('Project is built successfully');
