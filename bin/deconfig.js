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
const fs = require('fs');
const utils = require('./utils/utils');

const envPath = './.env';
const distPath = './dist';

program
    .description('Remove the custom configuration')
    .parse(process.argv);

if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
}

utils.removeDir(distPath);
