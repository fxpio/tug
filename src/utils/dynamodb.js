/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AWS from 'aws-sdk';
import Constraint from '../db/constraints/Constraint';
import Equal from '../db/constraints/Equal';

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
        let constraint = criteria[key] instanceof Constraint ? criteria[key] : new Equal(criteria[key]);
        exp.push(constraint.format('#' + key, ':' + key));
        keys['#' + key] = key;

        if (constraint.hasValue()) {
            values[':' + key] = AWS.DynamoDB.Converter.marshall({val: constraint.getValue()}).val;
        }

        let customValues = constraint.getCustomValues();
        for (let key of Object.keys(customValues)){
            values[':' + key] = AWS.DynamoDB.Converter.marshall({val: customValues[key]}).val;
        }
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
        let constraint = criteria[key] instanceof Constraint ? criteria[key] : new Equal(criteria[key]);
        exp.push(constraint.format('#' + key, ':' + key));
        keys['#' + key] = key;

        if (constraint.hasValue()) {
            values[':' + key] = AWS.DynamoDB.Converter.marshall({val: constraint.getValue()}).val;
        }
    }

    return {
        FilterExpression: exp.join(' AND '),
        ExpressionAttributeNames: keys,
        ExpressionAttributeValues: values
    };
}