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
const fetch = require('node-fetch');
const program = require('commander');
const utils = require('./utils/utils');
const getEndpoint = require('./utils/endpoint').getEndpoint;
const validateResponse = require('./utils/endpoint').validateResponse;
const createHeaders = require('./utils/endpoint').createHeaders;

program
    .description('Enable the Github repository')
    .option('-e, --endpoint [url]', 'Define the endpoint of Satis Serverless API (use for local dev)', false)
    .option('-u, --url [url]', 'The repository URL')
    .option('-t, --type [type]', 'The repository VCS type')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(() => getEndpoint(program))
    .then((endpoint) => {
        return fetch(endpoint + '/manager/repositories', {
            method: 'POST',
            body: JSON.stringify({
                url: program.url,
                type: program.type
            }),
            headers: createHeaders()
        })
    })
    .then(async (res) => await validateResponse(res))
    .then(async (res) => (await res.json()).message)
    .then((mess) => console.info(mess))
    .catch(utils.displayError);
