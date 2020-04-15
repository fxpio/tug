/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {isSqsRequest} from '@server/utils/apiQueue';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class QueueAuth implements AuthStrategy
{
    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        return isSqsRequest(req);
    }
}
