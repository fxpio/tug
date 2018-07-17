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
import ConfigManager from '../../../configs/ConfigManager';
import {isGithubEvent} from '../../../utils/apiGithub';
import {URL} from 'url';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GithubWebhookAuth extends AuthStrategy
{
    /**
     * @inheritDoc
     */
    async logIn(req) {
        let body = req.body,
            headers = req.headers;

        if (isGithubEvent(req) && body && body.sender && body.sender['events_url'] && headers['x-hub-signature']) {
            /** @typedef ConfigManager config */
            let config = await req.app.set('config-manager').get();
            let host = (new URL(body.sender['events_url'])).host;
                host = host.endsWith('.github.com') ? 'github.com' : host;
            let signature = headers['x-hub-signature'],
                payload = JSON.stringify(body),
                tokens = config.get('github-webhook'),
                secret = undefined !== tokens[host] ? tokens[host] : '',
                computedSignature = `sha1=${crypto.createHmac("sha1", secret).update(payload).digest("hex")}`;

            if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
                return true;
            }
        }

        return false;
    }
}
