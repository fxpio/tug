/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import auth from 'basic-auth';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BasicToken
{
    /**
     * Constructor.
     *
     * @param {Object} storage The storage
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Log in.
     *
     * @param {Request}  req
     * @param {Response} res
     * @param {Function} next
     */
    async logIn(req, res, next) {
        let user = auth(req);

        if (user && 'token' === user.name && await this.storage.has('api-keys/' + user.pass)) {
            next();
        }

        res.status(401).send();
    }
}
