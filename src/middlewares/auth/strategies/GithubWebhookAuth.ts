/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import crypto from 'crypto';
import {AuthStrategy} from './AuthStrategy';
import {ConfigManager} from '../../../configs/ConfigManager';
import {isGithubEvent} from '../../../utils/apiGithub';
import {URL} from 'url';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GithubWebhookAuth implements AuthStrategy
{
    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        let body = req.body,
            headers = req.headers;

        if (isGithubEvent(req) && body && body.sender && body.sender['events_url'] && headers['x-hub-signature']) {
            let config = await (req.app.get('config-manager') as ConfigManager).get();
            let host = (new URL(body.sender['events_url'])).host;
                host = host.endsWith('.github.com') ? 'github.com' : host;
            let signature: string = Array.isArray(headers['x-hub-signature']) ? (headers['x-hub-signature'] as Array<string>)[0] : headers['x-hub-signature'] as string,
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
