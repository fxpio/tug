/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RepositoryManager} from '@server/composer/repositories/RepositoryManager';
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
    let db = req.app.get('db') as Database;
    let repo = db.getRepository<CodeRepositoryRepository>(CodeRepositoryRepository);
    res.json(await repo.search({}, ['packageName', 'url'], <string> req.query.search, <string> req.query.lastId));
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
    });

    let repoManager = req.app.get('repository-manager') as RepositoryManager;
    let translator = req.app.get('translator') as Translator;
    let url = req.body.url;
    let type = req.body.type;
    let repo = await repoManager.register(url, type, res);
    (req.app.get('logger') as Logger).log('info', `[API Rest] Registration of the repository "${url}"`);

    res.json({
        message: translator.trans(res, 'manager.repository.created', {type: repo.getType(), url: repo.getUrl()}),
        url: repo.getUrl(),
        type: repo.getType()
    });
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

    let repoManager = req.app.get('repository-manager') as RepositoryManager;
    let translator = req.app.get('translator') as Translator;
    let url = await repoManager.unregister(req.body.url, res);
    (req.app.get('logger') as Logger).log('info', `[API Rest] Unregistration of the repository "${url}"`);

    res.json({
        message: translator.trans(res, 'manager.repository.deleted', {url: url}),
        url: url
    });
}
