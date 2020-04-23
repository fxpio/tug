/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Logger} from '@server/loggers/Logger';
import {MessageQueue} from '@server/queues/MessageQueue';
import {QueueReceiver} from '@server/queues/QueueReceiver';
import {LooseObject} from '@server/utils/LooseObject';
import {Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export abstract class BaseReceiver implements QueueReceiver {
    public static retryDelay: number = 2;

    protected readonly queue: MessageQueue;
    protected readonly logger: Logger;

    /**
     * Constructor.
     *
     * @param {MessageQueue} queue The message queue
     * @param {Logger}       logger The logger
     */
    protected constructor(queue: MessageQueue, logger: Logger) {
        this.queue = queue;
        this.logger = logger;
    }

    /**
     * @inheritDoc
     */
    public async execute(message: LooseObject, res?: Response): Promise<void> {
        try {
            await this.doExecute(message, res);
        } catch (e) {
            if ('ProvisionedThroughputExceededException' === e.name) {
                const delay = (message.retryDelay as number || 0) + BaseReceiver.retryDelay;
                message.retryDelay = delay;
                await this.queue.send(message, delay);
            } else {
                throw e;
            }
        }
    }

    /**
     * @inheritDoc
     */
    public async finish(res?: Response): Promise<void> {
    }

    /**
     * @inheritDoc
     */
    public abstract supports(message: LooseObject): boolean;

    /**
     * Execute the receiver.
     *
     * @param {LooseObject} message The message comes from queue
     * @param {Response}    [res]   The response
     */
    public abstract async doExecute(message: LooseObject, res?: Response): Promise<void>;
}
