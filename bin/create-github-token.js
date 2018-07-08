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
const createStorage = require('./utils/storage').createStorage;

program
    .description('Create or generate a Github token')
    .option('-l, --local', 'Use the local storage', false)
    .option('--key [key]', 'Your Github token, if empty a key will be generated')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let storage = await createStorage(program);
        let key = typeof program.key !== 'string' || '' === program.key ? utils.generateId(40) : program.key;

        await storage.put('github-token', key);

        return key;
    })
    .then((res) => {
        console.info(`The Github token "${res}" was created successfully`)
    })
    .catch(utils.displayError);
