/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AuthStrategy from './AuthStrategy';
import ConfigRepository from '../../../db/repositories/ConfigRepository';
import {isGitlabEvent} from "../../../utils/apiGitlab";

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

        if (isGitlabEvent(req) && body && body.hook && body.hook.config && req.headers['x-hub-signature']) {
            /** @type {ConfigRepository} repo */
            let repo = req.app.set('db').getRepository(ConfigRepository);
            let signature = req.headers['x-gitlab-token'],
                payload = JSON.stringify(body),
                config = await repo.get('gitlab-token'),
                secret = config ? config.token : '';

            if (signature === secret) {
                return true;
            }
        }

        return false;
    }
}
