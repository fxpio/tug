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
const fetch = require('node-fetch');
const utils = require('./utils/utils');
const getEndpoint = require('./utils/endpoint').getEndpoint;
const validateResponse = require('./utils/endpoint').validateResponse;
const createHeaders = require('./utils/endpoint').createHeaders;


program
    .description('Create or generate a token for Gitlab Oauth')
    .option('-e, --endpoint [url]', 'Define the endpoint of Satis Serverless API (use for local dev)', false)
    .option('-t, --token [token]', 'Your Gitlab personal token')
    .option('-h, --host [host]', 'Your Gitlab Enterprise host, if empty the host "gitlab.com" is used')
    .parse(process.argv);

utils.spawn('node bin/config -e')
    .then(() => getEndpoint(program))
    .then((endpoint) => {
        return fetch(endpoint + '/manager/gitlab-oauth', {
            method: 'POST',
            body: JSON.stringify({
                token: program.token,
                host: program.host
            }),
            headers: createHeaders()
        })
    })
    .then(async (res) => await validateResponse(res))
    .then(async (res) => (await res.json()).message)
    .then((mess) => console.info(mess))
    .catch(utils.displayError);
