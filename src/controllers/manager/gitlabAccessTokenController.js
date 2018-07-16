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
import {validateForm} from '../../utils/validation';

/**
 * Create the gitlab access token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function persistGitlabAccessToken(req, res, next) {
    validateForm(req, {
        token: Joi.string().required(),
        host: Joi.string()
    });

    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let token = req.body.token;
    let host = req.body.host ? req.body.host : 'gitlab.com';
    let data = {
        'gitlab-domains': [host],
        'gitlab-access-token': {}
    };
    data['gitlab-access-token'][host] = token;

    await configManager.put(data);

    res.json({
        message: `The Acccess token "${token}" to connect the server with your Gitlab account hosted on "${host}" was created successfully`,
        token: token
    });
}

/**
 * Delete the gitlab access token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteGitlabAccessToken(req, res, next) {
    validateForm(req, {
        host: Joi.string()
    });

    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let host = req.body.host ? req.body.host : 'gitlab.com';

    let config = (await configManager.get()).all();
    delete config['gitlab-access-token'][host];
    await configManager.put(config);

    res.json({
        message: `The Access token to connect the server with your Gitlab account hosted on "${host}" was deleted successfully`
    });
}

/**
 * Show the gitlab access token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGitlabAccessToken(req, res, next) {
    /** @type Config config */
    let config = await req.app.set('config-manager').get();

    let tokens = config.get('gitlab-access-token');
    let message = 'No Access Tokens for Gitlab are saved';

    if (tokens && Object.keys(tokens).length > 0) {
        let tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (let i = 0; i < tokenHosts.length; ++i) {
            strTokens += tokens[tokenHosts[i]] + ' (' + tokenHosts[i] + '), ';
        }

        message = `The Access Tokens to connect the server with your Gitlab account are "${strTokens.replace(/, $/g, '')}"`;
    }

    res.json({
        message: message,
        tokens: tokens
    });
}
