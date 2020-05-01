/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {And} from '@server/db/constraints/And';
import {Constraint} from '@server/db/constraints/Constraint';
import {Equal} from '@server/db/constraints/Equal';
import {Query} from '@server/db/constraints/Query';
import {LooseObject} from '@server/utils/LooseObject';
import AWS from 'aws-sdk';

/**
 * Convert the criteria into dynamo db parameters for query.
 *
 * @param {Query}  query     The query
 * @param {string} indexName The model index name
 *
 * @return {Object}
 */
export function convertQueryCriteria(query: Query, indexName = 'model-index'): Object {
    let exp: string|undefined;
    const model = query.getModel();
    const keys: LooseObject = {'#model': 'model'};
    const values: LooseObject = {':model': {S: model}};

    const qValues = query.getValues();
    for (const key of Object.keys(qValues)) {
        keys['#' + key] = key;
        values[':' + key] = AWS.DynamoDB.Converter.marshall({val: qValues[key]}).val;
    }

    exp = formatDynamodbConstraint(query.getConstraint());

    return {
        IndexName: indexName,
        KeyConditionExpression: '#model = :model',
        FilterExpression: exp ? exp : undefined,
        ExpressionAttributeNames: keys,
        ExpressionAttributeValues: values,
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

    criteria = Object.assign({}, criteria);

    const model = criteria.model;
    const constraints: Constraint[] = [];

    delete criteria.model;

    for (const key of Object.keys(criteria)) {
        const constraint = criteria[key] instanceof Constraint ? criteria[key] : new Equal(key, criteria[key]);
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
            const keys = Object.keys(constraint.getValues());

            exp = constraint.getKey() + ' IN (' + (keys.length > 0 ? ':' : '') + keys.join(', :') + ')';
            break;
        case 'EXISTS':
            exp = `attribute_exists(#${constraint.getKey()})`;
            break;
        case 'CONTAINS':
            exp = `contains(#${constraint.getKey()}, :${constraint.getKey()})`;
            break;
        case 'AND':
            const parts: string[] = [];
            for (const subConstraint of constraint.getValue() as Constraint[]) {
                parts.push(formatDynamodbConstraint(subConstraint));
            }
            exp = parts.length > 1 ? '(' + parts.join(' AND ') + ')' : parts.length > 0 ? parts.join(' AND ') : '';
            break;
        case 'OR':
            const orParts: string[] = [];
            for (const subConstraint of constraint.getValue() as Constraint[]) {
                orParts.push(formatDynamodbConstraint(subConstraint));
            }
            exp = orParts.length > 1 ? '(' + orParts.join(' OR ') + ')' : orParts.length > 0 ? orParts.join(' AND ') : '';
            break;
        default:
            break;
    }

    return exp;
}
