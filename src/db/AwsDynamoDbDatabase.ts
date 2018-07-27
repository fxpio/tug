/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AWS from 'aws-sdk';
import {Database} from './Database';
import {Results} from './Results';
import {LooseObject} from '../utils/LooseObject';
import {convertQueryCriteria} from '../utils/dynamodb';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AwsDynamoDbDatabase extends Database
{
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
            region: region,
            endpoint: endpoint && '' !== endpoint ? endpoint : undefined
        });
        this.client.config.region = region;

        if (endpoint && client) {
            this.client.config.endpoint = endpoint;
        }
    }

    /**
     * @inheritDoc
     */
    async has(id: string): Promise<boolean> {
        return null !== this.get(id);
    }

    /**
     * @inheritDoc
     */
    async get(id: string): Promise<LooseObject|null> {
        let params: any = {
            TableName: this.tableName,
            Key: {
                'id': {
                    'S': id
                }
            }
        };
        let res: any = await this.client.getItem(params).promise();

        return res.Item ? AwsDynamoDbDatabase.unmarshall(res.Item) : null;
    }

    /**
     * @inheritDoc
     */
    async put(data: LooseObject): Promise<LooseObject> {
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
    async delete(id: string): Promise<string> {
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
    async deletes(ids: string[]): Promise<string[]> {
        if (ids.length > 0) {
            let params: any = {RequestItems: {}};
            params.RequestItems[this.tableName] = [];

            for (let id of ids) {
                params.RequestItems[this.tableName].push({
                    DeleteRequest: {
                        Key: {'id': {'S': id}}
                    }
                });
            }

            await this.client.batchWriteItem(params).promise();
        }

        return ids;
    }

    /**
     * @inheritDoc
     */
    async find(criteria: LooseObject, startId?: string): Promise<Results> {
        let params: any = Object.assign(convertQueryCriteria(criteria), {
            TableName: this.tableName,
            ExclusiveStartKey: startId ? startId : null
        });

        let res: LooseObject = await this.client.query(params).promise();
        let resValues = [];
        for (let item of res.Items) {
            resValues.push(AwsDynamoDbDatabase.unmarshall(item));
        }

        return new Results(resValues, res.Count, res.LastEvaluatedKey ? res.LastEvaluatedKey.id.S : null);
    }

    /**
     * @inheritDoc
     */
    async findOne(criteria: LooseObject): Promise<LooseObject|null> {
        let params = Object.assign(convertQueryCriteria(criteria), {
            TableName: this.tableName
        });

        let res: LooseObject = await this.client.query(params).promise();

        return res.Count > 0 ? AwsDynamoDbDatabase.unmarshall(res.Items[0]) : null;
    }

    /**
     * Convert the data for DynamoDB.
     *
     * @param {any}     data      The data
     * @param {boolean} [subData] Check if is a sub data
     *
     * @return {any}
     */
    public static marshall(data: any, subData: boolean = false): any {
        if (data instanceof Date) {
            return data.toISOString();
        }

        if (Array.isArray(data)) {
            let values: any[] = [];
            for (let i = 0; i< data.length; ++i) {
                values.push(AwsDynamoDbDatabase.marshall(data[i], true));
            }

            return values;
        }

        if (typeof data === 'object') {
            let keys = Object.keys(data);
            let value: LooseObject = {};

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
     * @param {LooseObject} data The data
     *
     * @return {LooseObject}
     */
    public static unmarshall(data: any): LooseObject {
        return AWS.DynamoDB.Converter.unmarshall(data);
    }
}
