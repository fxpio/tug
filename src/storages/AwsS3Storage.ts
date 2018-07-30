/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataStorage} from '@app/storages/DataStorage';
import {LooseObject} from '@app/utils/LooseObject';
import AWS from 'aws-sdk';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AwsS3Storage implements DataStorage
{
    private readonly client: AWS.S3;

    private readonly bucket: string;

    /**
     * Constructor.
     *
     * @param {string} bucket   The AWS S3 bucket
     * @param {string} region   The AWS S3 region
     * @param {AWS.S3} [client] The AWS S3 client
     */
    constructor(bucket: string, region: string, client?: AWS.S3) {
        this.client = client || new AWS.S3({apiVersion: '2006-03-01', region: region});
        this.client.config.region = region;
        this.bucket = bucket;
    }

    /**
     * @inheritDoc
     */
    public async has(key: string): Promise<boolean> {
        let params = {
            Bucket: this.bucket,
            MaxKeys: 1,
            Prefix: key
        };

        let objects = await this.client.listObjectsV2(params).promise();

        return 1 === objects.KeyCount;
    }

    /**
     * @inheritDoc
     */
    public async get(key: string): Promise<string|null> {
        try {
            let params = {
                Bucket: this.bucket,
                Key: key
            };
            return (await this.client.getObject(params).promise() as LooseObject).Body.toString();
        } catch (e) {}

        return null;
    }

    /**
     * @inheritDoc
     */
    public async put(key: string, data: string|Buffer): Promise<string> {
        let params: LooseObject|any = {
            Bucket: this.bucket,
            Key: key.replace(/\/$/g, '')
        };

        if (undefined === data) {
            params.Key += '/';
            await this.client.putObject(params).promise();
        } else {
            params.Body = data;
            await this.client.upload(params).promise();
        }

        return key;
    }

    /**
     * @inheritDoc
     */
    public async delete(key: string): Promise<string> {
        let params = {
            Bucket: this.bucket,
            Key: key
        };

        await this.client.deleteObject(params).promise();

        return key;
    }
}
