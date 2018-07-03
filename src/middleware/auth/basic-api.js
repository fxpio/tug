/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import auth from 'basic-auth';
import AWS from 'aws-sdk';

export async function basicAuth(request, response, next) {
    let s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env.AWS_REGION}),
        s3Bucket = process.env.AWS_S3_BUCKET || null,
        user = auth(request);

    if (s3Bucket && user && 'token' === user.name) {
        let params = {
            Bucket: s3Bucket,
            MaxKeys: 1,
            Prefix: "api-keys/" + user.pass
        };

        let objects = await s3.listObjectsV2(params).promise();

        if (1 === objects.KeyCount) {
            next();
        }
    }

    return response.status(401).send();
}
