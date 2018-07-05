/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
    async logIn(req, res, next) {
        let body = req.body;

        if (isGithubEvent(req) && body && body.hook && body.hook.config) {
            let secret = body.hook.config.secret;

            if (secret && await this.storage.has('api-keys/' + secret)) {
                next();
                return;
            }
        }

        return super.logIn(req, res, next);
    }
}
