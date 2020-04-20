/*
 * This file is part of the Fxp Satis Serverless package.
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

    const staticOtps = {
        index: false,
        redirect: false,
        cacheControl: 'production' !== process.env.NODE_ENV,
    };
    const indexOpts = Object.assign({}, staticOtps, {cacheControl: false});

    router.get('/', asyncHandler(redirectHome));
    router.use('/admin', express.static(path.resolve(basePath, 'index.html'), indexOpts));
    router.use('/admin', express.static(basePath, staticOtps), fallbackAssets);
    router.use('/admin/*', express.static(path.resolve(basePath, 'index.html'), indexOpts), fallbackAssets);

    return router;
}
