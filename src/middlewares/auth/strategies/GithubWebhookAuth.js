/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isGithubEvent} from "../../../utils/apiGithub";

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GithubWebhookAuth
{
    /**
     * Constructor.
     *
     * @param {Object} storage The storage
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Log in.
     *
     * @param {IncomingMessage} req  The request
     * @param {ServerResponse}  res  The response
     * @param {Function}        next The next callback
     */
    async logIn(req, res, next) {
        let body = req.body;

        if (isGithubEvent(req) && body && body.hook && body.hook.config) {
            let secret = body.hook.config.secret;

            if (secret && await this.storage.has('api-keys/' + secret)) {
                next();
            }
        }

        res.status(401).send();
    }
}
