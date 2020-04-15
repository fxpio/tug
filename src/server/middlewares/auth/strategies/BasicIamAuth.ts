/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import AWS from 'aws-sdk';
import auth from 'basic-auth';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BasicIamAuth implements AuthStrategy {
    private readonly awsAccountId?: string;

    /**
     * Constructor.
     *
     * @param {string} [awsAccountId] The aws account id
     */
    constructor(awsAccountId?: string) {
        this.awsAccountId = awsAccountId;
    }

    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        const user = auth(req);
        let accessKeyId;
        let secretAccessKey;
        let sessionToken;

        if (user) {
            accessKeyId = user.name;
            secretAccessKey = user.pass;
        } else if (req.headers.authorization) {
            const auth = req.headers.authorization as string;

            if (auth.startsWith('token ')) {
                const parts = auth.substring(6).split(':');
                accessKeyId = parts[0];
                secretAccessKey = parts[1];
                sessionToken = parts[2];
            }
        }

        if (accessKeyId && secretAccessKey) {
            try {
                const sts = new AWS.STS({
                    apiVersion: '2011-06-15',
                    accessKeyId,
                    secretAccessKey,
                    sessionToken,
                });
                const res = await sts.getCallerIdentity({}).promise();

                return res.Account === this.awsAccountId || !this.awsAccountId;
            } catch (e) {}
        }

        return false;
    }
}
