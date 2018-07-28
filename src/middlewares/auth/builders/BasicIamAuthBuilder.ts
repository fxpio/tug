/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Request} from 'express';
import AWS from 'aws-sdk';
import {AuthBuilder} from './AuthBuilder';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BasicIamAuthBuilder implements AuthBuilder
{
    /**
     * @inheritDoc
     */
    public async createToken(req: Request): Promise<string|false> {
        try {
            let creds = req.body;
            let sts = new AWS.STS({apiVersion: '2011-06-15', accessKeyId: creds.username, secretAccessKey: creds.password});
            let result = await sts.getSessionToken().promise();
            let rc = result.Credentials;

            if (rc) {
                return `${rc.AccessKeyId}:${rc.SecretAccessKey}:${rc.SessionToken}`;
            }
        } catch (e) {}

        return false;
    }
}
