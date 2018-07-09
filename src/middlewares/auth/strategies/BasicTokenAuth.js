/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AuthStrategy from './AuthStrategy';
import ApiKeyRepository from '../../../db/repositories/ApiKeyRepository';
import auth from 'basic-auth';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BasicTokenAuth extends AuthStrategy
{
    /**
     * @inheritDoc
     */
    async logIn(req) {
        /** @type {ApiKeyRepository} repo */
        let repo = req.app.set('db').getRepository(ApiKeyRepository);
        let user = auth(req);

        return user && 'token' === user.name && await repo.has(user.pass);
    }
}
