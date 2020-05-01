/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
import {RepositoryNotFoundError} from '@server/errors/RepositoryNotFoundError';
import {Database} from '@server/db/Database';
import {CodeRepositoryRepository} from '@server/db/repositories/CodeRepositoryRepository';
import {Logger} from '@server/loggers/Logger';
import {Translator} from '@server/translators/Translator';
import {validateForm} from '@server/utils/validation';
import {Request, Response} from 'express';
import Joi from 'joi';

/**
 * List the repositories.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function listRepository(req: Request, res: Response, next: Function): Promise<void> {
    const db = req.app.get('db') as Database;
    const repo = db.getRepository<CodeRepositoryRepository>(CodeRepositoryRepository);
    res.json(await repo.search({}, ['packageName', 'url'], req.query.search as string, req.query.lastId as string));
}

/**
 * Enable the repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function enableRepository(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string().required(),
        type: Joi.string(),
    });

    const repoManager = req.app.get('repository-manager') as RepositoryManager;
    const translator = req.app.get('translator') as Translator;
    const url = req.body.url;
    const type = req.body.type;
    const repo = await repoManager.register(url, type, res);
    (req.app.get('logger') as Logger).log('info', `[API Rest] Registration of the repository "${url}"`);

    res.json({
        message: translator.trans(res, 'manager.repository.created', {type: repo.getType(), url: repo.getUrl()}),
        url: repo.getUrl(),
        type: repo.getType(),
    });
}

/**
 * Show the repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showRepository(req: Request, res: Response, next: Function): Promise<void> {
    const db = req.app.get('db') as Database;
    const repo1 = db.getRepository<CodeRepositoryRepository>(CodeRepositoryRepository);
    const result = await repo1.findOne({id: req.params.id});

    if (null === result) {
        throw new RepositoryNotFoundError(req.params.id);
    }

    res.json(result);
}

/**
 * Disable the repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function disableRepository(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string().required(),
    });

    const repoManager = req.app.get('repository-manager') as RepositoryManager;
    const translator = req.app.get('translator') as Translator;
    const url = await repoManager.unregister(req.body.url, res);
    (req.app.get('logger') as Logger).log('info', `[API Rest] Unregistration of the repository "${url}"`);

    res.json({
        message: translator.trans(res, 'manager.repository.deleted', {url}),
        url,
    });
}
