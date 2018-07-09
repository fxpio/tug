/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ApiKeyRepository from '../../db/repositories/ApiKeyRepository';
import {generateToken} from '../../utils/token';

/**
 * Create the api key.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createApiKey(req, res, next) {
    /** @type {ApiKeyRepository} repo */
    let repo = req.app.set('db').getRepository(ApiKeyRepository);
    let token = req.body.token ? req.body.token : generateToken(40);

    await repo.put({id: token});

    res.json({
        message: `The API key "${token}" was created successfully`,
        token: token
    });
}

/**
 * Delete the api key.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteApiKey(req, res, next) {
    /** @type {ApiKeyRepository} repo */
    let repo = req.app.set('db').getRepository(ApiKeyRepository);
    let token = req.body.token;

    if (!token) {
        res.status(400).json({
            message: 'The "token" body attribute is required'
        });
        return;
    }

    await repo.delete(token);

    res.json({
        message: `The API key "${token}" was deleted successfully`,
        token: token
    });
}
