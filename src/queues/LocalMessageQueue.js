/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import MessageQueue from './MessageQueue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class LocalMessageQueue extends MessageQueue
{
    /**
     * @inheritDoc
     */
    async send(message, delay = 0) {
        await this.receive([message]);
    }

    /**
     * @inheritDoc
     */
    async sendBatch(messages, delay = 0) {
        await this.receive(messages);
    }
}
