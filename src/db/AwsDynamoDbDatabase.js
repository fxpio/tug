/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AWS from 'aws-sdk';
import Database from './Database';
import Results from './Results';
import {convertQueryCriteria} from '../utils/dynamodb';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class AwsDynamoDbDatabase extends Database
{
    /**
     * @param {String}       tableName  The table name
     * @param {String}       region     The AWS DynamoDB region
     * @param {String}       [endpoint] The AWS DynamoDB endpoint
     * @param {AWS.DynamoDB} [client]   The client of DynamoDB
     */
    constructor(tableName, region, endpoint, client = null) {
        super();
        this.tableName = tableName;
        this.client = client || new AWS.DynamoDB({
            apiVersion: '2012-08-10',
            region: region,
            endpoint: endpoint ? endpoint : undefined
        });
        this.client.config.region = region;
        this.client.config.endpoint = endpoint;
    }

    /**
     * @inheritDoc
     */
    async has(id) {
        return null !== this.get(id);
    }

    /**
     * @inheritDoc
     */
    async get(id) {
        let params = {
            TableName: this.tableName,
            Key: {
                'id': {
                    'S': id
                }
            }
        };
        let res = await this.client.getItem(params).promise();

        return res.Item ? AwsDynamoDbDatabase.unmarshall(res.Item) : null;
    }

    /**
     * @inheritDoc
     */
    async put(data) {
        Database.validateData(data);
        let params = {
            TableName: this.tableName,
            Item: AwsDynamoDbDatabase.marshall(data)
        };
        await this.client.putItem(params).promise();

        return data;
    }

    /**
     * @inheritDoc
     */
    async delete(id) {
        let params = {
            TableName: this.tableName,
            Key: {'id': {'S': id}}
        };
        await this.client.deleteItem(params).promise();

        return id;
    }

    /**
     * @inheritDoc
     */
    async find(criteria, startId = null) {
        let params = Object.assign(convertQueryCriteria(criteria), {
            TableName: this.tableName,
            ExclusiveStartKey: startId ? startId : null
        });

        let res = await this.client.query(params).promise();
        let resValues = [];
        for (let item of res.Items) {
            resValues.push(AwsDynamoDbDatabase.unmarshall(item));
        }

        return new Results(resValues, res.Count, res.LastEvaluatedKey ? res.LastEvaluatedKey.id.S : null);
    }

    /**
     * @inheritDoc
     */
    async findOne(criteria) {
        let params = Object.assign(convertQueryCriteria(criteria), {
            TableName: this.tableName
        });

        let res = await this.client.query(params).promise();

        return res.Count > 0 ? AwsDynamoDbDatabase.unmarshall(res.Items[0]) : null;
    }

    /**
     * Convert the data for DynamoDB.
     *
     * @param {*}       data      The data
     * @param {Boolean} [subData] Check if is a sub data
     *
     * @return {Object}
     */
    static marshall(data, subData = false) {
        if (data instanceof Date) {
            return data.toISOString();
        }

        if (Array.isArray(data)) {
            let values = [];
            for (let i = 0; i< data.length; ++i) {
                values.push(AwsDynamoDbDatabase.marshall(data[i], true));
            }

            return values;
        }

        if (typeof data === 'object') {
            let keys = Object.keys(data);
            let value = {};

            for (let i = 0; i< keys.length; ++i) {
                let key = keys[i];
                value[key] = AwsDynamoDbDatabase.marshall(data[key], true);
            }

            data = value;
        }

        return subData ? data : AWS.DynamoDB.Converter.marshall(data);
    }

    /**
     * Convert the data of DynamoDB to javascript object.
     *
     * @param {Object} data The data
     *
     * @return {Object}
     */
    static unmarshall(data) {
        return AWS.DynamoDB.Converter.unmarshall(data);
    }
};
