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
import {isGithubEvent} from "../../../utils/apiGithub";

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GithubWebhookAuth extends AuthStrategy
{
    /**
     * Constructor.
     *
     * @param {DataStorage} storage The storage
     */
    constructor(storage) {
        super();
        this.storage = storage;
    }

    /**
     * @inheritDoc
     */
    async logIn(req) {
        let body = req.body;

        if (isGithubEvent(req) && body && body.hook && body.hook.config && req.headers['x-hub-signature']) {
            let signature = req.headers['x-hub-signature'],
                payload = JSON.stringify(body),
                secret = await this.storage.get('github-token') || '',
                computedSignature = `sha1=${crypto.createHmac("sha1", secret).update(payload).digest("hex")}`;

            if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
                return true;
            }
        }

        return false;
    }
}
