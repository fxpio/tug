/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MessageQueue} from '@server/queues/MessageQueue';
import {QueueReceiver} from '@server/queues/QueueReceiver';
import {LooseObject} from '@server/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BaseMessageQueue implements MessageQueue {
    private readonly receivers: QueueReceiver[];

    /**
     * Constructor.
     */
    constructor() {
        this.receivers = [];
    }

    /**
     * @inheritDoc
     */
    public subscribe(receiver: QueueReceiver): void {
        this.receivers.push(receiver);
    }

    /**
     * @inheritDoc
     */
    public async receive(messages: LooseObject[], res?: Response): Promise<void> {
        const ranReceivers: QueueReceiver[] = [];

        for (const message of messages) {
            for (const receiver of this.receivers) {
                if (receiver.supports(message)) {
                    await receiver.execute(message, res);

                    if (!ranReceivers.includes(receiver)) {
                        ranReceivers.push(receiver);
                    }
                }
            }
        }

        for (const receiver of ranReceivers) {
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
