/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Response} from 'express';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface QueueReceiver
{
    /**
     * Check if the receiver support the message.
     *
     * @param {LooseObject} message The message comes from queue
     *
     * @return {boolean}
     */
    supports(message: LooseObject): boolean;

    /**
     * Execute the receiver.
     *
     * @param {LooseObject} message The message comes from queue
     * @param {Response}    [res]   The response
     */
    execute(message: LooseObject, res?: Response): Promise<void>;

    /**
     * Finish the execution of the receiver.
     *
     * @param {Response} [res] The response
     */
    finish(res?: Response): Promise<void>;
}
