/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ConfigRepository from '../../db/repositories/ConfigRepository';
import {generateToken} from '../../utils/token';

/**
 * Create the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createGithubToken(req, res, next) {
    /** @type {ConfigRepository} repo */
    let repo = req.app.set('db').getRepository(ConfigRepository);
    let token = req.body.token ? req.body.token : generateToken(40);

    await repo.put({id: 'github-token', token: token});

    res.json({
        message: `The token "${token}" for Github Webhooks was created successfully`,
        token: token
    });
}

/**
 * Delete the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteGithubToken(req, res, next) {
    /** @type {ConfigRepository} repo */
    let repo = req.app.set('db').getRepository(ConfigRepository);

    await repo.delete('github-token');

    res.json({
        message: `The token for Github Webhooks was deleted successfully`
    });
}

/**
 * Show the github token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGithubToken(req, res, next) {
    /** @type {ConfigRepository} repo */
    let repo = req.app.set('db').getRepository(ConfigRepository);

    let data = await repo.get('github-token');
    let token = data && data.token ? data.token : null;
    let message = token ? `The token for Github Webhooks is "${token}"` : `The token for Github Webhooks is not generated`;

    res.json({
        message: message,
        token: token
    });
}
