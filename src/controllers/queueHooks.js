/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {getSqsMessageBodies} from "../utils/apiQueue";

/**
 * Run the queue receivers when the message comes form the queue.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function queueHook(req, res, next) {
    req.app.set('queue').receive(getSqsMessageBodies(req));
    res.status(204).send();
    next();
}
