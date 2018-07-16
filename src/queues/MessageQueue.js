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
    async receive(messages) {
        let ranReceivers = [];

        for (let i = 0; i < messages.length; ++i) {
            for (let j = 0; j < this.receivers.length; ++j) {
                /** @type {QueueReceiver} */
                let receiver = this.receivers[j];

                if (receiver.supports(messages[i])) {
                    await receiver.execute(messages[i]);

                    if (!ranReceivers.includes(receiver)) {
                        ranReceivers.push(receiver);
                    }
                }
            }
        }

        for (let i = 0; i < ranReceivers.length; ++i) {
            /** @type {QueueReceiver} */
            let receiver = ranReceivers[i];

            await receiver.finish();
        }
    }

    /**
     * Send a message in the queue.
     *
     * @param {String|Object} message
     * @param {Number}        delay
     */
    async send(message, delay = 0) {
    }

    /**
     * Send messages in the queue.
     *
     * @param {Array<String|Object>} messages
     * @param {Number}               delay
     */
    async sendBatch(messages, delay = 0) {
    }
}
