/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AuthStrategy from './AuthStrategy';
import {isGitlabEvent} from "../../../utils/apiGitlab";
import ConfigManager from '../../../configs/ConfigManager';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GitlabWebhookAuth extends AuthStrategy
{
    /**
     * @inheritDoc
     */
    async logIn(req) {
        let body = req.body;

        if (isGitlabEvent(req) && body && req.headers['x-gitlab-token']) {
            /** @type {ConfigManager} repo */
            let configManager = req.app.set('config-manager');
            let signature = req.headers['x-gitlab-token'],
                payload = JSON.stringify(body),
                config = await configManager.get(),
                secret = config.get('gitlab-webhook[' + req.headers.host + ']') 
                    ? config.get('gitlab-webhook[' + req.headers.host + ']')
                    : '';

            if (signature === secret) {
                return true;
            }
        }

        return false;
    }
}
