/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AWS from 'aws-sdk';
import auth from 'basic-auth';
import AuthStrategy from './AuthStrategy';
import {Request} from 'express';
import {createHash} from '../../../utils/crypto';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BasicIamAuth implements AuthStrategy
{
    private readonly debug: boolean;

    /**
     * Constructor.
     *
     * @param {boolean} debug The debug mode
     */
    constructor(debug = false) {
        this.debug = debug;
    }

    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        let user = auth(req),
            accessKeyId,
            secretAccessKey,
            sessionToken;

        if (user) {
            accessKeyId = user.name;
            secretAccessKey = user.pass;
        } else if (req.headers['authorization']) {
            let auth = req.headers['authorization'] as string;

            if (auth.startsWith('token ')) {
                let parts = auth.substring(6).split(':');
                accessKeyId = parts[0];
                secretAccessKey = parts[1];
                sessionToken = parts[2];
            }
        }

        return this.check(accessKeyId, secretAccessKey, sessionToken);
    }

    /**
     * Check the credentials.
     *
     * @param {string} [accessKeyId]
     * @param {string} [secretAccessKey]
     * @param {string} [sessionToken]
     *
     * @return {Promise<boolean>}
     */
    private async check(accessKeyId?: string, secretAccessKey?: string, sessionToken?: string): Promise<boolean> {
        if (this.debug) {
            return (accessKeyId === process.env.AWS_ACCESS_KEY_ID || accessKeyId === createHash(process.env.AWS_ACCESS_KEY_ID as string))
                && (secretAccessKey === process.env.AWS_SECRET_ACCESS_KEY || secretAccessKey === createHash(process.env.AWS_SECRET_ACCESS_KEY as string))
                && !sessionToken;
        }

        if (accessKeyId && secretAccessKey) {
            try {
                let sts = new AWS.STS({
                    apiVersion: '2011-06-15',
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                    sessionToken: sessionToken
                });
                let res = await sts.getCallerIdentity({}).promise();

                return res.Account === process.env.AWS_ACCOUNT_ID || !process.env.AWS_ACCOUNT_ID;
            } catch (e) {}
        }

        return false;
    }
}
