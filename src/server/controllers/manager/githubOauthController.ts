/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ConfigManager} from '@server/configs/ConfigManager';
import {Translator} from '@server/translators/Translator';
import {LooseObject} from '@server/utils/LooseObject';
import {generateToken} from '@server/utils/token';
import {validateForm} from '@server/utils/validation';
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
        token: Joi.string(),
        host: Joi.string(),
    });

    const configManager: ConfigManager = req.app.get('config-manager');
    const translator = req.app.get('translator') as Translator;
    const token = req.body.token ? req.body.token : generateToken(40);
    const host = req.body.host ? req.body.host : 'github.com';
    const data: LooseObject = {
        'github-oauth': {},
    };
    data['github-oauth'][host] = token;

    await configManager.put(data);

    res.json({
        message: translator.trans(res, 'manager.config.github-oauth.created', {token, host}),
        host,
        token,
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
        host: Joi.string(),
    });

    const configManager: ConfigManager = req.app.get('config-manager');
    const translator = req.app.get('translator') as Translator;
    const host = req.body.host ? req.body.host : 'github.com';

    const config = (await configManager.get()).all();
    delete config['github-oauth'][host];
    await configManager.put(config, true);

    res.json({
        message: translator.trans(res, 'manager.config.github-oauth.deleted', {host}),
        host,
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
    const config = await (req.app.get('config-manager') as ConfigManager).get();
    const translator = req.app.get('translator') as Translator;
    const tokens = config.get('github-oauth');
    let message;

    if (tokens && Object.keys(tokens).length > 0) {
        const tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (const tokenHost of tokenHosts) {
            strTokens += tokens[tokenHost] + ' (' + tokenHost + '), ';
        }

        message = translator.trans(res, 'manager.config.github-oauth', {tokens: strTokens.replace(/, $/g, '')});
    } else {
        message = translator.trans(res, 'manager.config.github-oauth.empty');
    }

    res.json({
        message,
        tokens,
    });
}
