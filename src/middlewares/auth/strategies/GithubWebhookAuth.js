/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import crypto from 'crypto';
import AuthStrategy from './AuthStrategy';
import ConfigRepository from '../../../db/repositories/ConfigRepository';
import {isGithubEvent} from "../../../utils/apiGithub";

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GithubWebhookAuth extends AuthStrategy
{
    /**
     * @inheritDoc
     */
    async logIn(req) {
        let body = req.body;

        if (isGithubEvent(req) && body && body.hook && body.hook.config && req.headers['x-hub-signature']) {
            /** @type {ConfigRepository} repo */
            let repo = req.app.set('db').getRepository(ConfigRepository);
            let signature = req.headers['x-hub-signature'],
                payload = JSON.stringify(body),
                config = await repo.get('github-token'),
                secret = config ? config.token : '',
                computedSignature = `sha1=${crypto.createHmac("sha1", secret).update(payload).digest("hex")}`;

            if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
                return true;
            }
        }

        return false;
    }
}
