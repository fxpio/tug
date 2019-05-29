/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PackageManager} from '@app/composer/packages/PackageManager';
import {HttpNotFoundError} from '@app/errors/HttpNotFoundError';
import {Translator} from '@app/translators/Translator';
import {LooseObject} from '@app/utils/LooseObject';
import {validateForm} from '@app/utils/validation';
import {Request, Response} from 'express';
import Joi from 'joi';

/**
 * List all package versions of a repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function listPackages(req: Request, res: Response, next: Function): Promise<void> {
    let manager: PackageManager = req.app.get('package-manager');
    let packageName = req.params.vendor + '/' + req.params.package;
    let result = await manager.findPackages(packageName);
    let versions: LooseObject = {};

    if (0 === Object.keys(result).length) {
        throw new HttpNotFoundError();
    }

    for (let i of Object.keys(result)) {
        let pack = result[i];
        versions[pack.getVersion()] = pack.getComposer();
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(versions);
    return;
}

/**
 * Refresh all packages or a single package of a repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function refreshPackages(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string(),
        version: Joi.string(),
        force: Joi.boolean()
    });

    let translator = req.app.get('translator') as Translator;
    let packageManager: PackageManager = req.app.get('package-manager');
    let url = req.body.url;
    let version = req.body.version;
    let force = true === req.body.force;
    let response: LooseObject = {};

    if (url) {
        response.url = (await packageManager.refreshPackages(url, force, res)).getUrl();
        response.message = translator.trans(res, 'manager.package.refresh.versions', {url: url});
    } else if (url && version) {
        response.url = (await packageManager.refreshPackage(url, version, force, res)).getUrl();
        response.message = translator.trans(res, 'manager.package.refresh.version', {url: url, version: version});
    } else {
        let repos = await packageManager.refreshAllPackages(force, res);
        response.message = translator.trans(res, 'manager.package.refresh.versions.all-repositories');
        response.urls = [];
        for (let name of Object.keys(repos)) {
            response.urls.push(repos[name].getUrl());
        }
    }

    res.json(response);
}

/**
 * Delete all packages or a single package of a repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function deletePackages(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string().required(),
        version: Joi.string()
    });

    let translator = req.app.get('translator') as Translator;
    let packageManager: PackageManager = req.app.get('package-manager');
    let url = req.body.url;
    let version = req.body.version;
    let message;

    if (version) {
        url = (await packageManager.deletePackage(url, version, res)).getUrl();
        message = translator.trans(res, 'manager.package.delete.version', {url: url, version: version});
    } else {
        url = (await packageManager.deletePackages(url, res)).getUrl();
        message = translator.trans(res, 'manager.package.delete.versions', {url: url});
    }

    res.json({
        message: message,
        url: url
    });
}

/**
 * Refresh only the cache for all packages or a single package of a repository.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function refreshCachePackages(req: Request, res: Response, next: Function): Promise<void> {
    validateForm(req, {
        url: Joi.string()
    });

    let translator = req.app.get('translator') as Translator;
    let packageManager: PackageManager = req.app.get('package-manager');
    let url = req.body.url;
    let response: LooseObject = {};

    if (url) {
        response.name = (await packageManager.refreshCachePackages(url, res)).getPackageName();
        response.message = translator.trans(res, 'manager.package.refresh.cache.version', {packageName: response.name});
    } else {
        let repos = await packageManager.refreshAllCachePackages(res);
        response.message = translator.trans(res, 'manager.package.refresh.cache.versions');
        response.names = [];
        for (let name of Object.keys(repos)) {
            response.names.push(repos[name].getPackageName());
        }
    }

    res.json(response);
}
