/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import QueueReceiver from './QueueReceiver';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class MessageQueue
{
    constructor() {
        this.receivers = [];
    }

    /**
     * Subscribe a receiver in queue.
     *
     * @param {QueueReceiver} receiver The queue receiver
     *
     * @return MessageQueue
     */
    subscribe(receiver) {
        if (receiver instanceof QueueReceiver) {
            this.receivers.push(receiver);
        }
    }

    /**
     * Receive the messages.
     *
     * @param {Array<Object>} messages The messages comes from queue
     */
    receive(messages) {
        for (let i = 0; i < this.receivers.length; ++i) {
            /** @type {QueueReceiver} */
            let receiver = this.receivers[i];

            if (receiver.supports(messages)) {
                receiver.execute(messages);
            }
        }
    }

    /**
     * Send a message in the queue.
     *
     * @param {String|Object} message
     */
    async send(message) {
    }

    /**
     * Send messages in the queue.
     *
     * @param {Array<String|Object>} messages
     */
    async sendBatch(messages) {
    }
}
