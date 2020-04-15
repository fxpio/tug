/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthBuilder} from '@server/middlewares/auth/builders/AuthBuilder';
import AWS from 'aws-sdk';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BasicIamAuthBuilder implements AuthBuilder {
    /**
     * @inheritDoc
     */
    public async createToken(req: Request): Promise<string|false> {
        try {
            const creds = req.body;
            const sts = new AWS.STS({apiVersion: '2011-06-15', accessKeyId: creds.username, secretAccessKey: creds.password});
            const result = await sts.getSessionToken().promise();
            const rc = result.Credentials;

            if (rc) {
                return `${rc.AccessKeyId}:${rc.SecretAccessKey}:${rc.SessionToken}`;
            }
        } catch (e) {}

        return false;
    }
}
