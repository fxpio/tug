/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ConfigManager from '../../configs/ConfigManager';
import Config from '../../configs/Config';
import {generateToken} from '../../utils/token';

/**
 * Create the gitlab token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function createGitlabToken(req, res, next) {
    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let token = req.body.token ? req.body.token : generateToken(40);
    let host = req.body.host ? req.body.host : 'gitlab.com';
    let data = {
        'gitlab-domains': [host],
        'gitlab-webhook': {}
    };
    data['gitlab-webhook'][host] = token;

    await configManager.put(data);

    res.json({
        message: `The token "${token}" for Gitlab Webhooks hosted on "${host}" was created successfully`,
        token: token
    });
}

/**
 * Delete the gitlab token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deleteGitlabToken(req, res, next) {
    /** @type ConfigManager configManager */
    let configManager = req.app.set('config-manager');
    let host = req.body.host ? req.body.host : 'gitlab.com';

    let config = (await configManager.get()).all();
    delete config['gitlab-webhook'][host];
    await configManager.put(config);

    res.json({
        message: `The token for Gitlab Webhooks hosted on "${host}" was deleted successfully`
    });
}

/**
 * Show the gitlab token.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showGitlabToken(req, res, next) {
    /** @type Config config */
    let config = await req.app.set('config-manager').get();

    let tokens = config.get('gitlab-webhook');
    let message = 'No tokens for Gitlab Webhooks are generated';

    if (tokens && Object.keys(tokens).length > 0) {
        let tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (let i = 0; i < tokenHosts.length; ++i) {
            strTokens += tokens[tokenHosts[i]] + ' (' + tokenHosts[i] + '), ';
        }

        message = `The tokens for Gitlab Webhooks are "${strTokens.replace(/, $/g, '')}"`;
    }

    res.json({
        message: message,
        tokens: tokens
    });
}
