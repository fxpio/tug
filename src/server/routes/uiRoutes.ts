/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {redirectHome} from '@server/controllers/ui/uiController';
import {asyncHandler} from '@server/utils/handler';
import express, {NextFunction, Request, Response, Router} from 'express';
import {RequestHandlerParams} from 'express-serve-static-core';
import path from 'path';

/**
 * Generate the routes.
 *
 * @param {Router}               router           The router
 * @param {boolean}              redirectToApp    Check if the redirection to the app is enabled
 * @param {string}               appBasePath      The base path of the app
 * @param {RequestHandlerParams} [fallbackAssets] The fallback asset
 *
 * @return {Router}
 */
export function uiRoutes(router: Router, redirectToApp: boolean, appBasePath: string, fallbackAssets?: RequestHandlerParams): Router {
    const basePath = path.resolve(__dirname, 'admin');

    if (!fallbackAssets) {
        fallbackAssets = (req: Request, res: Response, next: NextFunction) => {
            next();
        };
    }

    const staticOtps = {
        index: false,
        redirect: false,
        cacheControl: false,
    };
    const indexOpts = Object.assign({}, staticOtps);

    if (redirectToApp) {
        router.get('/', asyncHandler(redirectHome));
    }

    router.get(appBasePath, asyncHandler(redirectHome));
    router.use(appBasePath + '/app', express.static(path.resolve(basePath, 'index.html'), indexOpts));
    router.use(appBasePath, express.static(basePath, staticOtps), fallbackAssets);
    router.use(appBasePath + '/*', express.static(path.resolve(basePath, 'index.html'), indexOpts), fallbackAssets);

    return router;
}
