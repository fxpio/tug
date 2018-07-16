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
 * Create the gitlab oauth token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createGitlabOauth(req, res, next) {
    validateForm(req, {
        token: Joi.string().required(),
        host: Joi.string()
    });

    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let token = req.body.token ? req.body.token : generateToken(40);
    let host = req.body.host ? req.body.host : 'gitlab.com';
    let data = {
        'gitlab-domains': [host],
        'gitlab-oauth': {}
    };
    data['gitlab-oauth'][host] = token;

    await configManager.put(data);

    res.json({
        message: `The Oauth token "${token}" to connect the server with your Gitlab account hosted on "${host}" was created successfully`,
        token: token
    });
}

/**
 * Delete the gitlab oauth token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteGitlabOauth(req, res, next) {
    validateForm(req, {
        host: Joi.string()
    });

    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let host = req.body.host ? req.body.host : 'gitlab.com';

    let config = (await configManager.get()).all();
    delete config['gitlab-oauth'][host];
    await configManager.put(config);

    res.json({
        message: `The Oauth token to connect the server with your Gitlab account hosted on "${host}" was deleted successfully`
    });
}

/**
 * Show the gitlab oauth token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGitlabOauth(req, res, next) {
    /** @type Config config */
    let config = await req.app.set('config-manager').get();

    let tokens = config.get('gitlab-oauth');
    let message = 'No tokens for Gitlab Oauth are saved';

    if (tokens && Object.keys(tokens).length > 0) {
        let tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (let i = 0; i < tokenHosts.length; ++i) {
            strTokens += tokens[tokenHosts[i]] + ' (' + tokenHosts[i] + '), ';
        }

        message = `The Oauth tokens to connect the server with your Gitlab account are "${strTokens.replace(/, $/g, '')}"`;
    }

    res.json({
        message: message,
        tokens: tokens
    });
}
