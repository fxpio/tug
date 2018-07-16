/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import PackageManager from '../../composer/packages/PackageManager';
import {validateForm} from '../../utils/validation';

/**
 * Refresh all packages or a single package of a repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function refreshPackages(req, res, next) {
    validateForm(req, {
        url: Joi.string().required(),
        version: Joi.string(),
        force: Joi.boolean()
    });

    /** @type {PackageManager} repoManager */
    let packageManager = req.app.set('package-manager');
    let url = req.body.url;
    let version = req.body.version;
    let force = true === req.body.force;
    let message;

    if (version) {
        url = (await packageManager.refreshPackage(url, version, force)).getUrl();
        message = `Refreshing of package version "${version}" has started for the repository "${url}"`;
    } else {
        url = (await packageManager.refreshPackages(url, force)).getUrl();
        message = `Refreshing of all packages has started for the repository "${url}"`;
    }

    res.json({
        message: message,
        url: url
    });
}

/**
 * Delete all packages or a single package of a repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function deletePackages(req, res, next) {
    validateForm(req, {
        url: Joi.string().required(),
        version: Joi.string()
    });

    /** @type {PackageManager} repoManager */
    let packageManager = req.app.set('package-manager');
    let url = req.body.url;
    let version = req.body.version;
    let message;

    if (version) {
        url = (await packageManager.deletePackage(url, version)).getUrl();
        message = `Deleting of package version "${version}" has started for the repository "${url}"`;
    } else {
        url = (await packageManager.deletePackages(url)).getUrl();
        message = `Deleting of all packages has started for the repository "${url}"`;
    }

    res.json({
        message: message,
        url: url
    });
}
