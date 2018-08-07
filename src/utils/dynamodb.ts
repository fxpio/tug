/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from '@app/db/constraints/Constraint';
import {Equal} from '@app/db/constraints/Equal';
import {LooseObject} from '@app/utils/LooseObject';
import AWS from 'aws-sdk';
import merge from 'lodash.merge';

/**
 * Convert the criteria into dynamo db parameters for query.
 *
 * @param {object} criteria  The criteria
 * @param {string} indexName The model index name
 *
 * @return {Object}
 */
export function convertQueryCriteria(criteria: LooseObject, indexName = 'model-index'): Object {
    criteria = merge({}, criteria);

    let exp = [],
        model = criteria && criteria.model ? criteria.model : null,
        keys: LooseObject = {'#model': 'model'},
        values:LooseObject = {':model': {'S': model}};

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
        FilterExpression: exp.length > 0 ? exp.join(' AND ') : undefined,
        ExpressionAttributeNames: keys,
        ExpressionAttributeValues: values
    };
}
