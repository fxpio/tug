/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthStrategy} from './AuthStrategy';
import {isGitlabEvent} from "../../../utils/apiGitlab";
import {URL} from 'url';
import {Request} from 'express';
import {Config} from '../../../configs/Config';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GitlabWebhookAuth implements AuthStrategy
{
    /**
     * @inheritDoc
     */
    async logIn(req: Request): Promise<boolean> {
        let body = req.body,
            headers = req.headers;

        if (isGitlabEvent(req) && headers['x-gitlab-token'] && body && body.repository && body.repository['git_http_url']) {

            let config: Config = await req.app.get('config-manager').get();
            let host = (new URL(body.repository['git_http_url'])).host;
                host = host.endsWith('.gitlab.com') ? 'gitlab.com' : host;
            let signature = headers['x-gitlab-token'],
                tokens = config.get('gitlab-webhook'),
                secret = undefined !== tokens[host] ? tokens[host] : '';

            if (signature === secret) {
                return true;
            }
        }

        return false;
    }
}
