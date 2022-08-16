/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const AWS = require('aws-sdk');

/**
 * Retrieve the endpoint of the Tug API.
 *
 * @param {commander} [program] The commander js
 *
 * @return {DataStorage}
 */
module.exports.getEndpoint = async function getEndpoint(program) {
    if (program && program.endpoint) {
        let url = program.endpoint.replace(/\/$/g, '');

        return url.includes('://') ? url : 'http://' + url;
    }

    try {
        const env = require('./../utils/env').loadEnvs();
        let cf = new AWS.CloudFormation({apiVersion: '2010-05-15', credentials: {accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY}});
        let resources = await cf.describeStackResources({StackName: process.env.AWS_STACK_NAME, LogicalResourceId: 'Endpoint'}).promise();

        if (resources.StackResources.length > 0 && 'AWS::ApiGateway::RestApi' === resources.StackResources[0].ResourceType) {
            let resource = resources.StackResources[0],
                id = resource.PhysicalResourceId,
                region = resource.StackId.split(':')[3];

            return 'https://' + id + '.execute-api.' + region + '.amazonaws.com/prod';
        }
    } catch (e) {}

    throw new Error('Impossible to retrieve the endpoint of your Tug API');
};

/**
 * Validate the successful response.
 *
 * @param {Response} res The fetch response
 *
 * @return {Promise<Response>}
 */
module.exports.validateResponse = async function validateResponse(res) {
    if (res.status >= 200 && res.status < 300) {
        return res;
    }

    let message = `The endpoint has returned the "${res.status}" status code`;

    try {
        let json = await res.json();
        if (json.message) {
            message += ` with the message "${json.message}"`;
        }
    } catch (e) {}

    throw new Error(message + '.');
};

/**
 * Create the default http headers for the endpoint API.
 *
 * @param {Object} [headers] The http headers
 *
 * @return {Object}
 */
module.exports.createHeaders = function createHeaders(headers = {}) {
    let auth = Buffer.from(process.env.AWS_ACCESS_KEY_ID + ':' + process.env.AWS_SECRET_ACCESS_KEY, 'utf-8');

    let defaults = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + auth.toString('base64')
    };

    return Object.assign({}, defaults, headers);
};
