/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import AWS from 'aws-sdk';
import {Request, Response} from 'express';
import {HttpUnauthorizedError} from '../../errors/HttpUnauthorizedError';
import {validateForm} from '../../utils/validation';
import {isProd} from '../../utils/server';
import {createHash} from '../../utils/crypto';

/**
 * Create the temporary token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function createToken(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    if (!isProd()) {
        res.json({
            token: `${createHash(process.env.AWS_ACCESS_KEY_ID as string)}:${createHash(process.env.AWS_SECRET_ACCESS_KEY as string)}`
        });
        return;
    }

    try {
        let creds = req.body;
        let sts = new AWS.STS({apiVersion: '2011-06-15', accessKeyId: creds.username, secretAccessKey: creds.password});
        let result = await sts.getSessionToken().promise();
        let rc = result.Credentials;
        if (rc) {
            res.json({
                token: `${rc.AccessKeyId}:${rc.SecretAccessKey}:${rc.SessionToken}`
            });
            return;
        }
    } catch (e) {}

    throw new HttpUnauthorizedError('Your credentials are invalid');
}
