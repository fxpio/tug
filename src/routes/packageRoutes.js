/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Authenticate from '../middlewares/auth/Authenticate';
import BasicTokenAuth from '../middlewares/auth/strategies/BasicTokenAuth';
import {asyncHandler} from '../utils/handler';
import {
    showPackageVersion,
    showPackageVersions,
    showRootPackages,
    trackDownloadBatch
} from '../controllers/packages/packageController';

/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export default function packageRoutes(router) {
    router.use(asyncHandler(Authenticate.middleware(new BasicTokenAuth())));

    router.get('/packages.json', asyncHandler(showRootPackages));
    router.post('/downloads', asyncHandler(trackDownloadBatch));
    router.get('/p/:vendor/:package.json', asyncHandler(showPackageVersions));
    router.get('/p/:vendor/:package/:version.json', asyncHandler(showPackageVersion));

    return router;
}
