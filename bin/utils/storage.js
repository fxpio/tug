/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const AWS = require('aws-sdk');
const LocalStorage = require('../../src/storages/LocalStorage');
const AwsS3Storage = require('../../src/storages/AwsS3Storage');

/**
 * Create the storage.
 *
 * @param {commander}   [program] The commander js
 * @param {String|null} [bucket]  The bucket name
 *
 * @return {DataStorage}
 */
module.exports.createStorage = async function createStorage(program, bucket = null) {
    if (program && program.local) {
        return new LocalStorage('./var/storage');
    }

    if (null === bucket) {
        try {
            let cf = new AWS.CloudFormation({apiVersion: '2010-05-15'});
            let resources = await cf.describeStackResources({StackName: process.env.AWS_STACK_NAME, LogicalResourceId: 'Storage'}).promise();

            if (resources.StackResources.length > 0 && 'AWS::S3::Bucket' === resources.StackResources[0].ResourceType) {
                bucket = resources.StackResources[0].PhysicalResourceId;
            }
        } catch (e) {}

        if (!bucket) {
            throw new Error('The AWS S3 bucket name is required to create the storage');
        }
    }

    return new AwsS3Storage(bucket, process.env.AWS_REGION);
};
