/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseMessageQueue} from '@server/queues/BaseMessageQueue';
import {LooseObject} from '@server/utils/LooseObject';
import AWS from 'aws-sdk';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AwsSqsMessageQueue extends BaseMessageQueue
{
    private readonly queueUrl: string;
    private readonly batchSize: number;
    private readonly client: AWS.SQS;

    /**
     * Constructor.
     *
     * @param {string}  queueUrl    The AWS queue url
     * @param {number}  [batchSize] The batch size
     * @param {AWS.SQS} [client]    The AWS SQS client
     */
    constructor(queueUrl: string, batchSize: number = 10, client?: AWS.SQS) {
        super();
        this.queueUrl = queueUrl;
        this.batchSize = batchSize;
        this.client = client || new AWS.SQS({apiVersion: '2012-11-05'});
    }

    /**
     * @inheritDoc
     */
    public async send(message: LooseObject, delay?: number): Promise<void> {
        let params = {
            QueueUrl: this.queueUrl,
            DelaySeconds: delay || 0,
            MessageBody: typeof message === 'object' ? JSON.stringify(message) : message
        };
        await this.client.sendMessage(params).promise();
    }

    /**
     * @inheritDoc
     */
    public async sendBatch(messages: LooseObject[], delay?: number): Promise<void> {
        let nextMessages = [];
        let params: LooseObject|any = {
            QueueUrl: this.queueUrl,
            Entries: []
        };

        if (0 === messages.length) {
            return;
        }

        for (let i = 0; i < messages.length; ++i) {
            let message = messages[i];
            if (i < this.batchSize) {
                params.Entries.push({
                    Id: 'message_' + i,
                    DelaySeconds: delay || 0,
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
