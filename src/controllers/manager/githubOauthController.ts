/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ConfigManager} from '@app/configs/ConfigManager';
import {Translator} from '@app/translators/Translator';
import {LooseObject} from '@app/utils/LooseObject';
import {generateToken} from '@app/utils/token';
import {validateForm} from '@app/utils/validation';
import {Request, Response} from 'express';
import Joi from 'joi';

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
    let translator = req.app.get('translator') as Translator;
    let token = req.body.token ? req.body.token : generateToken(40);
    let host = req.body.host ? req.body.host : 'github.com';
    let data: LooseObject = {
        'github-domains': [host],
        'github-oauth': {}
    };
    data['github-oauth'][host] = token;

    await configManager.put(data);

    res.json({
        message: translator.trans(res, 'manager.config.github-oauth.created', {token: token, host: host}),
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
    let translator = req.app.get('translator') as Translator;
    let host = req.body.host ? req.body.host : 'github.com';

    let config = (await configManager.get()).all();
    delete config['github-oauth'][host];
    await configManager.put(config);

    res.json({
        message: translator.trans(res, 'manager.config.github-oauth.deleted', {host: host}),
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
    let translator = req.app.get('translator') as Translator;
    let tokens = config.get('github-oauth');
    let message;

    if (tokens && Object.keys(tokens).length > 0) {
        let tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (let i = 0; i < tokenHosts.length; ++i) {
            strTokens += tokens[tokenHosts[i]] + ' (' + tokenHosts[i] + '), ';
        }

        message = translator.trans(res, 'manager.config.github-oauth', {tokens: strTokens.replace(/, $/g, '')});
    } else {
        message = translator.trans(res, 'manager.config.github-oauth.empty');
    }

    res.json({
        message: message,
        tokens: tokens
    });
}
