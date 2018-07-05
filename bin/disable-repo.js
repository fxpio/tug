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
    .description('Disable the Github repository')
    .option('-l, --local', 'Use the local storage', false)
    .option('-r, --repository [name]', 'The repository name (<username-organization>/<repository>)')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(async () => {
        let storage = createStorage(program);
        let repo = program.repository;

        if (typeof repo !== 'string' || '' === repo) {
            throw new Error('The "--repository" option is required');
        }

        if (!repo.match(/\//)) {
            throw new Error('The repository name must be formated with "<username-or-organization-name>/<repository-name>"');
        }

        await storage.delete('repositories/' + repo + '/');

        return repo;
    })
    .then((res) => {
        console.info(`The repository "${res}" were disabled successfully`)
    })
    .catch(utils.displayError);
