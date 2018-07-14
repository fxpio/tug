/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AWS from 'aws-sdk';
import MessageQueue from './MessageQueue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class AwsSqsMessageQueue extends MessageQueue
{
    /**
     * Constructor.
     *
     * @param {String}  queueUrl    The AWS queue url
     * @param {Number}  [batchSize] The batch size
     * @param {AWS.SQS} [client]    The AWS SQS client
     */
    constructor(queueUrl, batchSize = 10, client = null) {
        super();
        this.queueUrl = queueUrl;
        this.batchSize = batchSize;
        this.client = client || new AWS.SQS({apiVersion: '2012-11-05'});
    }

    /**
     * @inheritDoc
     */
    async send(message, delay = 0) {
        let params = {
            QueueUrl: this.queueUrl,
            DelaySeconds: delay,
            MessageBody: typeof message === 'object' ? JSON.stringify(message) : message
        };
        await this.client.sendMessage(params).promise();
    }

    /**
     * @inheritDoc
     */
    async sendBatch(messages, delay = 0) {
        let nextMessages = [];
        let params = {
            QueueUrl: this.queueUrl,
            Entries: []
        };

        if (0 === messages.length) {
            return;
        }

        for (let i = 0; i < messages.length; ++i) {
            if (i < this.batchSize) {
                params.Entries.push({
                    Id: i,
                    DelaySeconds: delay,
                    MessageBody: typeof message === 'object' ? JSON.stringify(message) : message
                });
            } else {
                nextMessages.push(message);
            }
        }

        await this.client.sendMessageBatch(params).promise();

        if (nextMessages.length > 0) {
            await this.sendBatch(nextMessages, delay);
        }
    }
}
