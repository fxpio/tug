/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '@server/db/Database';
import {ApiKeyRepository} from '@server/db/repositories/ApiKeyRepository';
import {HttpValidationError} from '@server/errors/HttpValidationError';
import {Translator} from '@server/translators/Translator';
import {generateToken} from '@server/utils/token';
import {validateForm} from '@server/utils/validation';
import {Request, Response} from 'express';
import Joi from 'joi';

/**
 * List the api keys.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function listApiKey(req: Request, res: Response, next: Function): Promise<void> {
    const db = req.app.get('db') as Database;
    const repo = db.getRepository<ApiKeyRepository>(ApiKeyRepository);
    res.json(await repo.search({}, ['id'], req.query.search as string, req.query.lastId as string));
}

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
        token: Joi.string().min(10),
    });

    const translator = req.app.get('translator') as Translator;
    const repo = (req.app.get('db') as Database).getRepository(ApiKeyRepository);
    const data = {
        id: req.body.token ? req.body.token : generateToken(40),
        createdAt: (new Date()).toISOString(),
    };

    await repo.put(data);

    res.json({
        message: translator.trans(res, 'manager.api-key.created', {token: data.id}),
        token: data.id,
        createdAt: data.createdAt,
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
        token: Joi.string().min(10),
    });

    const translator = req.app.get('translator') as Translator;
    const repo = (req.app.get('db') as Database).getRepository(ApiKeyRepository);
    const token = req.body.token;

    if (!token) {
        throw new HttpValidationError({
            token: translator.trans(res, 'validation.field.required'),
        });
    }

    await repo.delete(token);

    res.json({
        message: translator.trans(res, 'manager.api-key.deleted', {token}),
        token,
    });
}
