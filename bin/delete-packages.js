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

require('dotenv').config({path: '.env.local'});
const fetch = require('node-fetch');
const program = require('commander');
const utils = require('./utils/utils');
const getEndpoint = require('./utils/endpoint').getEndpoint;
const validateResponse = require('./utils/endpoint').validateResponse;
const createHeaders = require('./utils/endpoint').createHeaders;

program
    .description('Delete the versions of package')
    .option('-e, --endpoint <url>', 'Define the endpoint of Tug API (use for local dev)', false)
    .option('-u, --url <url>', 'The repository URL')
    .option('-n, --version <version>', 'The specific version, or empty to delete all versions')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(() => getEndpoint(program))
    .then((endpoint) => {
        return fetch(endpoint + '/manager/packages', {
            method: 'DELETE',
            body: JSON.stringify({
                url: program.url,
                version: program.version
            }),
            headers: createHeaders()
        })
    })
    .then(async (res) => await validateResponse(res))
    .then(async (res) => (await res.json()).message)
    .then((mess) => console.info(mess))
    .catch(utils.displayError);
