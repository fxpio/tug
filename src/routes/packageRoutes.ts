/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Authenticate} from '@app/middlewares/auth/Authenticate';
import {BasicTokenAuth} from '@app/middlewares/auth/strategies/BasicTokenAuth';
import {Router} from 'express';
import {asyncHandler} from '@app/utils/handler';
import {
    showPackageVersion,
    showPackageVersions,
    showRootPackages,
    trackDownloadBatch
} from '@app/controllers/packages/packageController';

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
