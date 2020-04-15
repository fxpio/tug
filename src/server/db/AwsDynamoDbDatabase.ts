/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Query} from '@server/db/constraints/Query';
import {Database} from '@server/db/Database';
import {Results} from '@server/db/Results';
import {convertQueryCriteria, criteriaToQuery} from '@server/utils/dynamodb';
import {LooseObject} from '@server/utils/LooseObject';
import AWS from 'aws-sdk';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AwsDynamoDbDatabase extends Database {

    /**
     * Convert the data for DynamoDB.
     *
     * @param {*}       data      The data
     * @param {boolean} [subData] Check if is a sub data
     *
     * @return {*}
     */
    public static marshall(data: any, subData: boolean = false): any {
        if (data instanceof Date) {
            return data.toISOString();
        }

        if (Array.isArray(data)) {
            const values: any[] = [];

            for (const val of data) {
                values.push(AwsDynamoDbDatabase.marshall(val, true));
            }

            return values;
        }

        if (typeof data === 'object') {
            const keys = Object.keys(data);
            const value: LooseObject = {};

            for (const key of keys) {
                value[key] = AwsDynamoDbDatabase.marshall(data[key], true);
            }

            data = value;
        }

        return subData ? data : AWS.DynamoDB.Converter.marshall(data);
    }

    /**
     * Convert the data of DynamoDB to javascript object.
     *
     * @param {LooseObject} data The data
     *
     * @return {LooseObject}
     */
    public static unmarshall(data: any): LooseObject {
        return AWS.DynamoDB.Converter.unmarshall(data);
    }
    private readonly tableName: string;

    private readonly client: AWS.DynamoDB;

    /**
     * @param {string}       tableName  The table name
     * @param {string}       region     The AWS DynamoDB region
     * @param {string}       [endpoint] The AWS DynamoDB endpoint
     * @param {AWS.DynamoDB} [client]   The client of DynamoDB
     */
    constructor(tableName: string, region: string, endpoint?: string, client = null) {
        super();
        this.tableName = tableName;
        this.client = client || new AWS.DynamoDB({
            apiVersion: '2012-08-10',
            region,
            endpoint: endpoint && '' !== endpoint ? endpoint : undefined,
        });
        this.client.config.region = region;

        if (endpoint && client) {
            this.client.config.endpoint = endpoint;
        }
    }

    /**
     * @inheritDoc
     */
    public async has(id: string): Promise<boolean> {
        return null !== await this.get(id);
    }

    /**
     * @inheritDoc
     */
    public async get(id: string): Promise<LooseObject|null> {
        const params: any = {
            TableName: this.tableName,
            Key: {
                id: {
                    S: id,
                },
            },
        };
        const res: any = await this.client.getItem(params).promise();

        return res.Item ? AwsDynamoDbDatabase.unmarshall(res.Item) : null;
    }

    /**
     * @inheritDoc
     */
    public async put(data: LooseObject): Promise<LooseObject> {
        Database.validateData(data);
        const params = {
            TableName: this.tableName,
            Item: AwsDynamoDbDatabase.marshall(data),
        };
        await this.client.putItem(params).promise();

        return data;
    }

    /**
     * @inheritDoc
     */
    public async delete(id: string): Promise<string> {
        const params = {
            TableName: this.tableName,
            Key: {id: {S: id}},
        };
        await this.client.deleteItem(params).promise();

        return id;
    }

    /**
     * @inheritDoc
     */
    public async deletes(ids: string[]): Promise<string[]> {
        if (ids.length > 0) {
            const params: any = {RequestItems: {}};
            params.RequestItems[this.tableName] = [];

            for (const id of ids) {
                params.RequestItems[this.tableName].push({
                    DeleteRequest: {
                        Key: {id: {S: id}},
                    },
                });
            }

            await this.client.batchWriteItem(params).promise();
        }

        return ids;
    }

    /**
     * @inheritDoc
     */
    public async find(criteria: Query|LooseObject, startId?: string): Promise<Results> {
        const query = criteriaToQuery(criteria);
        const params: any = Object.assign(convertQueryCriteria(query), {
            TableName: this.tableName,
            ExclusiveStartKey: startId ? {model: {S: query.getModel()}, id: {S: startId as string}} : null,
        });

        let res: LooseObject = {Count: 0, Items: []};
        const resValues = [];

        try {
            res = await this.client.query(params).promise();
        } catch (e) {}

        for (const item of res.Items) {
            resValues.push(AwsDynamoDbDatabase.unmarshall(item));
        }

        return new Results(resValues, res.Count, res.LastEvaluatedKey ? res.LastEvaluatedKey.id.S : null);
    }

    /**
     * @inheritDoc
     */
    public async findOne(criteria: Query|LooseObject): Promise<LooseObject|null> {
        const params = Object.assign(convertQueryCriteria(criteriaToQuery(criteria)), {
            TableName: this.tableName,
        });

        const res: LooseObject = await this.client.query(params).promise();

        return res.Count > 0 ? AwsDynamoDbDatabase.unmarshall(res.Items[0]) : null;
    }
}
