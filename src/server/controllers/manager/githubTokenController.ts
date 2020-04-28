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
        host: Joi.string(),
    });

    const configManager: ConfigManager = req.app.get('config-manager');
    const translator = req.app.get('translator') as Translator;
    const token = req.body.token ? req.body.token : generateToken(40);
    const host = req.body.host ? req.body.host : 'github.com';
    const data: LooseObject = {
        'github-domains': [host],
        'github-webhook': {},
    };
    data['github-webhook'][host] = token;

    await configManager.put(data);

    res.json({
        message: translator.trans(res, 'manager.config.github-token.created', {token, host}),
        host,
        token,
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
        host: Joi.string(),
    });

    const configManager: ConfigManager = req.app.get('config-manager');
    const translator = req.app.get('translator') as Translator;
    const host = req.body.host ? req.body.host : 'github.com';

    const config = (await configManager.get()).all();
    delete config['github-webhook'][host];
    await configManager.put(config);

    res.json({
        message: translator.trans(res, 'manager.config.github-token.deleted', {host}),
        host,
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
    const config = await (req.app.get('config-manager') as ConfigManager).get();
    const translator = req.app.get('translator') as Translator;
    const tokens = config.get('github-webhook');
    let message;

    if (tokens && Object.keys(tokens).length > 0) {
        const tokenHosts = Object.keys(tokens);
        let strTokens = '';
        for (const tokenHost of tokenHosts) {
            strTokens += tokens[tokenHost] + ' (' + tokenHost + '), ';
        }

        message = translator.trans(res, 'manager.config.github-token', {tokens: strTokens.replace(/, $/g, '')});
    } else {
        message = translator.trans(res, 'manager.config.github-token.empty');
    }

    res.json({
        message,
        tokens,
    });
}
