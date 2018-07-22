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
        let user = auth(req);

        if (user) {
            if (this.debug) {
                return user.name === process.env.AWS_ACCESS_KEY_ID && user.pass === process.env.AWS_SECRET_ACCESS_KEY;
            }

            try {
                let sts = new AWS.STS({apiVersion: '2011-06-15', accessKeyId: user.name, secretAccessKey: user.pass});
                await sts.getCallerIdentity({}).promise();

                return true;
            } catch (e) {}
        }

        return false;
    }
}
