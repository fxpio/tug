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
 * Create the github oauth token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function createGithubOauth(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        token: Joi.string().required(),
        host: Joi.string()
    });

    let configManager: ConfigManager = req.app.get('config-manager');
    let token = req.body.token ? req.body.token : generateToken(40);
    let host = req.body.host ? req.body.host : 'github.com';
    let data: LooseObject = {
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
 * Delete the github oauth token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function deleteGithubOauth(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        host: Joi.string()
    });

    let configManager: ConfigManager = req.app.get('config-manager');
    let host = req.body.host ? req.body.host : 'github.com';

    let config = (await configManager.get()).all();
    delete config['github-oauth'][host];
    await configManager.put(config);

    res.json({
        message: `The Oauth token to connect the server with your Github account hosted on "${host}" was deleted successfully`
    });
}

/**
 * Show the github oauth token.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showGithubOauth(req: Request, res: Response, next: Function): Promise<void> {
    let config = await (req.app.get('config-manager') as ConfigManager).get();

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
