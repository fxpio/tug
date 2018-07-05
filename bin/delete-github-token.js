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
const createStorage = require('./utils/storage').createStorage;
const utils = require('./utils/utils');

program
    .description('Delete the Github token')
    .option('-l, --local', 'Use the local storage', false)
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let storage = createStorage(program);

        await storage.delete('github-token');
    })
    .then(() => {
        console.info(`The Github token was deleted successfully`)
    })
    .catch(utils.displayError);
