/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '@server/db/Database';
import {ApiKeyRepository} from '@server/db/repositories/ApiKeyRepository';
import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import auth from 'basic-auth';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BasicTokenAuth implements AuthStrategy {
    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        const repo = (req.app.get('db') as Database).getRepository(ApiKeyRepository);
        const user = auth(req);

        return undefined !== user && 'token' === user.name && await repo.has(user.pass);
    }
}
