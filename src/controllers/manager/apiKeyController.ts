/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import {ApiKeyRepository} from '../../db/repositories/ApiKeyRepository';
import {generateToken} from '../../utils/token';
import {validateForm} from '../../utils/validation';
import {Database} from '../../db/Database';
import {Request, Response} from 'express';

/**
 * Create the api key.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function createApiKey(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        token: Joi.string().min(10)
    });

    let repo = (req.app.get('db') as Database).getRepository(ApiKeyRepository);
    let token = req.body.token ? req.body.token : generateToken(40);

    await repo.put({id: token});

    res.json({
        message: `The API key "${token}" was created successfully`,
        token: token
    });
}

/**
 * Delete the api key.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function deleteApiKey(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        token: Joi.string().min(10)
    });

    let repo = (req.app.get('db') as Database).getRepository(ApiKeyRepository);
    let token = req.body.token;

    if (!token) {
        res.status(400).json({
            message: 'The "token" body attribute is required'
        });
        return;
    }

    await repo.delete(token);

    res.json({
        message: `The API key "${token}" was deleted successfully`,
        token: token
    });
}
