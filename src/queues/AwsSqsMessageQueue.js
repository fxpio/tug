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
     * @param {String}  region    The AWS region
     * @param {String}  accountId The AWS account id
     * @param {String}  queueName The AWS queue name
     * @param {AWS.SQS} [client]  The AWS SQS client
     */
    constructor(region, accountId, queueName, client = null) {
        super();
        this.region = region;
        this.accountId = accountId;
        this.queueName = queueName;
        this.client = client || new AWS.SQS({apiVersion: '2012-11-05', region: region});
        this.client.config.region = region;
    }

    /**
     * @inheritDoc
     */
    async send(message) {
        let params = {
            QueueUrl: 'https://sqs.' + this.region + '.amazonaws.com/' + this.accountId + '/' + this.queueName,
            MessageBody: typeof message === 'object' ? JSON.stringify(message) : message
        };
        await this.client.sendMessage(params).promise();
    }

    /**
     * @inheritDoc
     */
    async sendBatch(messages) {
        let nextMessages = [];
        let params = {
            QueueUrl: 'https://sqs.' + this.region + '.amazonaws.com/' + this.accountId + '/' + this.queueName,
            Entries: []
        };

        for (let i = 0; i < messages.length; ++i) {
            if (i < 10) {
                params.Entries.push({
                    Id: i,
                    MessageBody: typeof message === 'object' ? JSON.stringify(message) : message
                });
            } else {
                nextMessages.push(message);
            }
        }

        await this.client.sendMessageBatch(params).promise();

        if (nextMessages.length > 0) {
            await this.sendBatch(nextMessages);
        }
    }
}
