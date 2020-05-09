/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Config} from '@server/configs/Config';
import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {isGitlabEvent} from '@server/utils/apiGitlab';
import {Request} from 'express';
import {URL} from 'url';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GitlabWebhookAuth implements AuthStrategy {
    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        const body = req.body;
        const headers = req.headers;

        if (isGitlabEvent(req) && headers['x-gitlab-token'] && body && body.repository && body.repository.git_http_url) {

            const config: Config = await req.app.get('config-manager').get();
            let host = (new URL(body.repository.git_http_url)).host;
            host = host.endsWith('.gitlab.com') ? 'gitlab.com' : host;
            const signature = headers['x-gitlab-token'];
            const tokens = config.get('gitlab-webhook');
            const secret = undefined !== tokens[host] ? tokens[host] : '';

            if (signature === secret) {
                return true;
            }
        }

        return false;
    }
}
