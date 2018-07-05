/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const AWS = require('aws-sdk');
const DataStorage = require('./DataStorage');

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
module.exports = class AwsS3Storage extends DataStorage
{
    /**
     * Constructor.
     *
     * @param {String} bucket The AWS S3 bucket
     * @param {String} region The AWS S3 region
     */
    constructor(bucket, region) {
        super();
        this.client = new AWS.S3({apiVersion: '2006-03-01', region: region});
        this.bucket = bucket;
    }

    /**
     * @inheritDoc
     */
    async has(key) {
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
    async put(key, data) {
        let params = {
            Bucket: this.bucket,
            Key: key
        };

        if (undefined === data) {
            await this.client.putObject(params).promise();
        } else {
            params.Body = data;
            await this.client.upload(params).promise();
        }

        return super.put(key, data);
    }

    /**
     * @inheritDoc
     */
    async delete(key) {
        let params = {
            Bucket: this.bucket,
            Key: key
        };

        await this.client.deleteObject(params).promise();

        return super.delete(key);
    }
};
