/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import {ConfigManager} from '../../configs/ConfigManager';
import {generateToken} from '../../utils/token';
import {validateForm} from '../../utils/validation';
import {Request, Response} from 'express';
import {LooseObject} from '../../utils/LooseObject';

/**
 * Create the github token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function createGithubToken(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        token: Joi.string().min(10),
        host: Joi.string()
    });

    let configManager: ConfigManager = req.app.get('config-manager');
    let token = req.body.token ? req.body.token : generateToken(40);
    let host = req.body.host ? req.body.host : 'github.com';
    let data:LooseObject = {
        'github-domains': [host],
        'github-webhook': {}
    };
    data['github-webhook'][host] = token;

    await configManager.put(data);

    res.json({
        message: `The token "${token}" for Github Webhooks hosted on "${host}" was created successfully`,
        token: token
    });
}

/**
 * Delete the github token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function deleteGithubToken(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        host: Joi.string()
    });

    let configManager: ConfigManager = req.app.get('config-manager');
    let host = req.body.host ? req.body.host : 'github.com';

    let config = (await configManager.get()).all();
    delete config['github-webhook'][host];
    await configManager.put(config);

    res.json({
        message: `The token for Github Webhooks hosted on "${host}" was deleted successfully`
    });
}

/**
 * Show the github token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showGithubToken(req: Request, res: Response, next: Function): Promise<void> {
    let config = await (req.app.get('config-manager') as ConfigManager).get();

    let tokens = config.get('github-webhook');
    let message = 'No tokens for Github Webhooks are generated';

    if (tokens && Object.keys(tokens).length > 0) {
        let tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (let i = 0; i < tokenHosts.length; ++i) {
            strTokens += tokens[tokenHosts[i]] + ' (' + tokenHosts[i] + '), ';
        }

        message = `The tokens for Github Webhooks are "${strTokens.replace(/, $/g, '')}"`;
    }

    res.json({
        message: message,
        tokens: tokens
    });
}
