/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isSqsRequest} from '../../../utils/apiQueue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class QueueAuth
{
    /**
     * Log in.
     *
     * @param {IncomingMessage} req  The request
     * @param {ServerResponse}  res  The response
     * @param {Function}        next The next callback
     */
    async logIn(req, res, next) {
        if (isSqsRequest(req)) {
            next();
        }

        res.status(401).send();
    }
}
