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
const utils = require('./utils/utils');

program
    .description('Package and deploy the project')
    .option('-f, --force', 'Force to rebuild the project', false)
    .option('--force-package', 'Force to rebuild the package only', false)
    .parse(process.argv);

let opts = (program.force ? ' --force' : '') + (program.forcePackage ? ' --force-package' : '');

utils.spawn('node bin/package' + opts)
    .then(() => utils.spawn('node bin/deploy'))
    .catch(utils.displayError);
