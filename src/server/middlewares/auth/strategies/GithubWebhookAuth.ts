/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ConfigManager} from '@server/configs/ConfigManager';
import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {isGithubEvent} from '@server/utils/apiGithub';
import crypto from 'crypto';
import {Request} from 'express';
import {URL} from 'url';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GithubWebhookAuth implements AuthStrategy {
    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        const body = req.body;
        const headers = req.headers;

        if (isGithubEvent(req) && body && body.sender && body.sender.events_url && headers['x-hub-signature']) {
            const config = await (req.app.get('config-manager') as ConfigManager).get();
            let host = (new URL(body.sender.events_url)).host;
            host = host.endsWith('.github.com') ? 'github.com' : host;
            const signature: string = Array.isArray(headers['x-hub-signature']) ? (headers['x-hub-signature'] as string[])[0] : headers['x-hub-signature'] as string;
            const payload = JSON.stringify(body);
            const tokens = config.get('github-webhook');
            const secret = undefined !== tokens[host] ? tokens[host] : '';
            const computedSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;

            if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
                return true;
            }
        }

        return false;
    }
}
