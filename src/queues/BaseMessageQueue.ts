/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Response} from 'express';
import {QueueReceiver} from '@app/queues/QueueReceiver';
import {MessageQueue} from '@app/queues/MessageQueue';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BaseMessageQueue implements MessageQueue
{
    private readonly receivers: Array<QueueReceiver>;

    /**
     * Constructor.
     */
    constructor() {
        this.receivers = [];
    }

    /**
     * @inheritDoc
     */
    subscribe(receiver: QueueReceiver): void {
        this.receivers.push(receiver);
    }

    /**
     * @inheritDoc
     */
    public async receive(messages: LooseObject[], res?: Response): Promise<void> {
        let ranReceivers:QueueReceiver[] = [];

        for (let i = 0; i < messages.length; ++i) {
            for (let j = 0; j < this.receivers.length; ++j) {
                /** @type {QueueReceiver} */
                let receiver = this.receivers[j];

                if (receiver.supports(messages[i])) {
                    await receiver.execute(messages[i], res);

                    if (!ranReceivers.includes(receiver)) {
                        ranReceivers.push(receiver);
                    }
                }
            }
        }

        for (let i = 0; i < ranReceivers.length; ++i) {
            /** @type {QueueReceiver} */
            let receiver = ranReceivers[i];

            await receiver.finish(res);
        }
    }

    /**
     * @inheritDoc
     */
    public async send(message: LooseObject, delay?: number): Promise<void> {
    }

    /**
     * @inheritDoc
     */
    public async sendBatch(messages: LooseObject[], delay?: number): Promise<void> {
    }
}
