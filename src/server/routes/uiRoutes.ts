/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {redirectHome, showWebApp} from '@server/controllers/ui/uiController';
import {asyncHandler} from '@server/utils/handler';
import express, {NextFunction, Request, Response, Router} from 'express';
import {RequestHandlerParams} from 'express-serve-static-core';
import path from 'path';

/**
 * Generate the routes.
 *
 * @param {Router}               router           The router
 * @param {RequestHandlerParams} [fallbackAssets] The fallback asset
 *
 * @return {Router}
 */
export function uiRoutes(router: Router, fallbackAssets?: RequestHandlerParams): Router {
    const basePath = path.resolve(__dirname, 'admin');

    if (!fallbackAssets) {
        fallbackAssets = (req: Request, res: Response, next: NextFunction) => {
            next();
        };
    }

    router.get('/', asyncHandler(redirectHome));
    router.get('/admin', asyncHandler(showWebApp));
    router.use('/admin/sw.js', express.static(path.resolve(basePath, 'sw.js'), {index: false, redirect: false}), fallbackAssets);
    router.use('/admin/assets', express.static(path.resolve(basePath, 'assets'), {index: false, redirect: false}), fallbackAssets);
    router.get('/admin/*', asyncHandler(showWebApp));

    return router;
}
