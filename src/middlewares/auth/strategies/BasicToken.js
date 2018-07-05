/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AuthStrategy from './AuthStrategy';
import auth from 'basic-auth';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BasicToken extends AuthStrategy
{
    /**
     * Constructor.
     *
     * @param {DataStorage} storage The storage
     */
    constructor(storage) {
        super();
        this.storage = storage;
    }

    /**
     * @inheritDoc
     */
    async logIn(req, res, next) {
        let user = auth(req);

        if (user && 'token' === user.name && await this.storage.has('api-keys/' + user.pass)) {
            next();
            return;
        }

        return super.logIn(req, res, next);
    }
}
