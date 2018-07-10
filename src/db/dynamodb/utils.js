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
 * Convert the criteria into dynamo db parameters for query.
 *
 * @param {object} criteria  The criteria
 * @param {String} indexName The model index name
 *
 * @return {Object}
 */
export function convertQueryCriteria(criteria, indexName = 'model-index') {
    let exp = [],
        model = criteria && criteria.model ? criteria.model : null,
        keys = {'#model': 'model'},
        values = {':model': {'S': model}};

    delete criteria.model;

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
 * Convert the criteria into dynamo db parameters for scan.
 *
 * @param {Object} criteria The criteria
 *
 * @return {Object}
 */
export function convertScanCriteria(criteria) {
    let exp = [],
        keys = {},
        values = {};

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
