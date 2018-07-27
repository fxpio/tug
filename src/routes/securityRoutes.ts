/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BasicIamAuth} from '../middlewares/auth/strategies/BasicIamAuth';
import {Authenticate} from '../middlewares/auth/Authenticate';
import {Router} from 'express';
import {asyncHandler} from '../utils/handler';
import {createToken} from '../controllers/securities/authController';
import {isProd} from '../utils/server';

/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export function securityRoutes(router: Router): Router {
    router.put('/authorizations', asyncHandler(Authenticate.middleware(new BasicIamAuth(!isProd()))), asyncHandler(createToken));

    return router;
}
