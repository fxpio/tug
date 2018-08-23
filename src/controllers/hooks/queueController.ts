/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MessageQueue} from '@app/queues/MessageQueue';
import {getSqsMessageBodies} from '@app/utils/apiQueue';
import {Request, Response} from 'express';

/**
 * Run the queue receivers when the message comes form the queue.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function queueHook(req: Request, res: Response, next: Function): Promise<void> {
    await (req.app.get('queue') as MessageQueue).receive(getSqsMessageBodies(req), res);
    res.status(204).send();
}
