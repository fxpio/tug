/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import ConfigManager from '../../configs/ConfigManager';
import Config from '../../configs/Config';
import {generateToken} from '../../utils/token';
import {validateForm} from '../../utils/validation';

/**
 * Create the github oauth token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createGithubOauth(req, res, next) {
    validateForm(req, {
        token: Joi.string().required(),
        host: Joi.string()
    });

    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let token = req.body.token ? req.body.token : generateToken(40);
    let host = req.body.host ? req.body.host : 'github.com';
    let data = {
        'github-domains': [host],
        'github-oauth': {}
    };
    data['github-oauth'][host] = token;

    await configManager.put(data);

    res.json({
        message: `The Oauth token "${token}" to connect the server with your Github account hosted on "${host}" was created successfully`,
        token: token
    });
}

/**
 * Show the github oauth token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGithubOauth(req, res, next) {
    /** @type Config config */
    let config = await req.app.set('config-manager').get();

    let tokens = config.get('github-oauth');
    let message = 'No tokens for Github Oauth are saved';

    if (tokens && Object.keys(tokens).length > 0) {
        let tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (let i = 0; i < tokenHosts.length; ++i) {
            strTokens += tokens[tokenHosts[i]] + ' (' + tokenHosts[i] + '), ';
        }

        message = `The Oauth tokens to connect the server with your Github account are "${strTokens.replace(/, $/g, '')}"`;
    }

    res.json({
        message: message,
        tokens: tokens
    });
}
