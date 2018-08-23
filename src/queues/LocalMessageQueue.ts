/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseMessageQueue} from '@app/queues/BaseMessageQueue';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class LocalMessageQueue extends BaseMessageQueue
{
    /**
     * @inheritDoc
     */
    public async send(message: LooseObject, delay?: number): Promise<void> {
        await this.sendBatch([message], delay);
    }

    /**
     * @inheritDoc
     */
    public async sendBatch(messages: LooseObject[], delay?: number): Promise<void> {
        if (0 === messages.length) {
            return;
        }

        let self = this;
        setTimeout(async function () {
            await self.receive(messages);
        }, (delay || 0) * 1000);
    }
}
