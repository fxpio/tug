/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {And} from '@app/db/constraints/And';
import {Constraint} from '@app/db/constraints/Constraint';
import {Equal} from '@app/db/constraints/Equal';
import {Query} from '@app/db/constraints/Query';
import {LooseObject} from '@app/utils/LooseObject';
import AWS from 'aws-sdk';
import merge from 'lodash.merge';

/**
 * Convert the criteria into dynamo db parameters for query.
 *
 * @param {Query}  query     The query
 * @param {string} indexName The model index name
 *
 * @return {Object}
 */
export function convertQueryCriteria(query: Query, indexName = 'model-index'): Object {
    let exp: string|undefined,
        model = query.getModel(),
        keys: LooseObject = {'#model': 'model'},
        values:LooseObject = {':model': {'S': model}};

    let qValues = query.getValues();
    for (let key of Object.keys(qValues)) {
        keys['#' + key] = key;
        values[':' + key] = AWS.DynamoDB.Converter.marshall({val: qValues[key]}).val;
    }

    exp = formatDynamodbConstraint(query.getConstraint());

    return {
        IndexName: indexName,
        KeyConditionExpression: '#model = :model',
        FilterExpression: exp ? exp : undefined,
        ExpressionAttributeNames: keys,
        ExpressionAttributeValues: values
    };
}

/**
 * Concert the criteria into Query.
 *
 * @param {Query|LooseObject} criteria
 *
 * @return {Query}
 */
export function criteriaToQuery(criteria: Query|LooseObject): Query {
    if (criteria instanceof Query) {
        return criteria;
    }

    criteria = merge({}, criteria);

    let model = criteria.model;
    let constraints: Constraint[] = [];

    delete criteria.model;

    for (let key of Object.keys(criteria)) {
        let constraint = criteria[key] instanceof Constraint ? criteria[key] : new Equal(key, criteria[key]);
        constraints.push(constraint);
    }

    return new Query(new And(constraints), model ? model : undefined);
}

/**
 * Format the constraint for dynamodb.
 *
 * @param {Constraint} constraint
 *
 * @return {string}
 */
export function formatDynamodbConstraint(constraint: Constraint): string {
    let exp = '';

    switch (constraint.getOperator()) {
        case '=':
            exp = `#${constraint.getKey()} = :${constraint.getKey()}`;
            break;
        case '!=':
            exp = `#${constraint.getKey()} <> :${constraint.getKey()}`;
            break;
        case 'NOT':
            exp = `NOT(${formatDynamodbConstraint(constraint.getValue())})`;
            break;
        case 'IN':
            let keys = Object.keys(constraint.getValues());

            exp = constraint.getKey() + ' IN (' + (keys.length > 0 ? ':' : '') + keys.join(', :') + ')';
            break;
        case 'EXISTS':
            exp = `attribute_exists(#${constraint.getKey()})`;
            break;
        case 'AND':
            let parts: string[] = [];
            for (let subConstraint of <Constraint[]> constraint.getValue()) {
                parts.push(formatDynamodbConstraint(subConstraint));
            }
            exp = parts.length > 0 ? '(' + parts.join(' AND ') + ')' : '';
            break;
        default:
            break;
    }

    return exp;
}
