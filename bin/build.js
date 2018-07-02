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

const CONTENT_PATH = './dist';

program
    .description('Build the project')
    .option('-d, --dev', 'Build the code without code optimization', false)
    .option('-f, --force', 'Force to rebuild the project', false)
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(() => {
        if (!program.force && fse.existsSync(CONTENT_PATH)) {
            console.info('Project is already built. Use the "--force" option to rebuild the project');
            return true;
        }

        console.info('Project build is started...');

        // clean dist directory
        fse.removeSync(CONTENT_PATH);

        return utils.spawn('webpack' + (program.dev ? '' : ' --production'));
    })
    .then((skip) => {
        if (true !== skip) {
            console.info('Project is built successfully');
        }
    })
    .catch(utils.displayError);
