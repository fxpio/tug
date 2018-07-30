/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {redirectHome, showWebApp} from '@app/controllers/ui/uiController';
import {asyncHandler} from '@app/utils/handler';
import {Router} from 'express';

/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export function uiRoutes(router: Router): Router {
    router.get('/', asyncHandler(redirectHome));
    router.get('/admin', asyncHandler(redirectHome));
    router.get('/admin/*', asyncHandler(showWebApp));

    return router;
}
