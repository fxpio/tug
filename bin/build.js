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

const SRC_PATH = './src';
const CONTENT_PATH = './dist';

program
    .description('Build the project')
    .option('-f, --force', 'Force to rebuild the project', false)
    .parse(process.argv);

utils.exec('node bin/config -e', [], function () {
    if (!program.force && fse.existsSync(CONTENT_PATH)) {
        console.info('Project is already built. Use the "--force" option to rebuild the project');
        return;
    }

    // clean dist directory
    fse.removeSync(CONTENT_PATH);

    // copy sources
    fse.copySync(SRC_PATH, CONTENT_PATH);

    // copy dependencies
    fse.copySync('./package.json', CONTENT_PATH + '/package.json');
    fse.copySync('./yarn.lock', CONTENT_PATH + '/yarn.lock');
    utils.execSync('yarn install --prod', {}, {
        cwd: CONTENT_PATH
    });
    fse.removeSync(CONTENT_PATH + '/package.json');
    fse.removeSync(CONTENT_PATH + '/yarn.lock');

    // copy and configure the aws templates
    let files = ['./aws/simple-proxy-api.yaml', './aws/cloudformation.yaml'];

    if (!fse.existsSync(CONTENT_PATH)){
        fse.mkdirSync(CONTENT_PATH);
    }

    files.forEach((file) => {
        let fileContentModified = utils.replaceVariables(fse.readFileSync(file, 'utf8'));
        fse.writeFileSync(CONTENT_PATH + '/' + file.replace('./aws', ''), fileContentModified, 'utf8')
    });

    console.info('Project is built successfully');
});
