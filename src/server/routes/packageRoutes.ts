/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
    showPackageVersion,
    showPackageVersions,
    showRootPackages,
    trackDownloadBatch
} from '@server/controllers/packages/packageController';
import {Authenticate} from '@server/middlewares/auth/Authenticate';
import {BasicTokenAuth} from '@server/middlewares/auth/strategies/BasicTokenAuth';
import {asyncHandler} from '@server/utils/handler';
import {Router} from 'express';

/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export function packageRoutes(router: Router): Router {
    router.use(asyncHandler(Authenticate.middleware(new BasicTokenAuth())));

    router.get('/packages.json', asyncHandler(showRootPackages));
    router.post('/downloads', asyncHandler(trackDownloadBatch));
    router.get('/p/:vendor/:package.json', asyncHandler(showPackageVersions));
    router.get('/p/:vendor/:package/:version.json', asyncHandler(showPackageVersion));

    return router;
}
