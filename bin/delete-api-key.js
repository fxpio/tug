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
    .description('Delete a API key')
    .option('-l, --local', 'Use the local storage', false)
    .option('--key [key]', 'The API key')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let storage = createStorage(program);
        let key = program.key;

        if (typeof key !== 'string' || '' === key) {
            throw new Error('The "--key" option with the api key value is required');
        }

        await storage.delete('api-keys/' + key + '/');

        return key;
    })
    .then((res) => {
        console.info(`The API key "${res}" was deleted successfully`)
    })
    .catch(utils.displayError);
