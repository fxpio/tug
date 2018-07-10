/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AWS from 'aws-sdk';

/**
 * Clean the prefix of id.
 *
 * @param {Object}      data   The data
 * @param {String|null} prefix The prefix
 *
 * @return {Object}
 */
export function cleanModelPrefix(data, prefix = null) {
    if (prefix && typeof data === 'object' && data.id && typeof data.id === 'string') {
        data.id = data.id.replace(new RegExp('^' + prefix + ':', 'g'), '');
    }

    return data;
}

/**
 *
 * @param {object} criteria  The criteria
 * @param {String} model     The model type
 * @param {String} indexName The model index name
 */
export function convertQueryCriteria(criteria, model, indexName = 'model-index') {
    let exp = [],
        keys = {'#model': 'model'},
        values = {':model': {'S': model}};

    for (let key of Object.keys(criteria)) {
        exp.push('#' + key + ' = :' + key);
        keys['#' + key] = key;
        values[':' + key] = AWS.DynamoDB.Converter.marshall({val: criteria[key]}).val;
    }

    return {
        IndexName: indexName,
        KeyConditionExpression: '#model = :model',
        FilterExpression: exp.join(' AND '),
        ExpressionAttributeNames: keys,
        ExpressionAttributeValues: values
    };
}

/**
 * Convert the criteria into dynamo db parameters.
 *
 * @param {Object}      criteria The criteria
 * @param {String|null} prefix   The prefix id
 *
 * @return {{FilterExpression: string, ExpressionAttributeNames, ExpressionAttributeValues}}
 */
export function convertScanCriteria(criteria, prefix = null) {
    let exp = [],
        keys = {},
        values = {};

    if (prefix) {
        exp.push('begins_with(#id, :idPrefix)');
        keys['#id'] = 'id';
        values[':idPrefix'] = {'S' : prefix+':'};
    }

    for (let key of Object.keys(criteria)) {
        exp.push('#' + key + ' = :' + key);
        keys['#' + key] = key;
        values[':' + key] = AWS.DynamoDB.Converter.marshall({val: criteria[key]}).val;
    }

    return {
        FilterExpression: exp.join(' AND '),
        ExpressionAttributeNames: keys,
        ExpressionAttributeValues: values
    };
}
