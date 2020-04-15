/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {createToken} from '@server/controllers/securities/authController';
import {Authenticate} from '@server/middlewares/auth/Authenticate';
import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {asyncHandler} from '@server/utils/handler';
import {Router} from 'express';

/**
 * Generate the routes.
 *
 * @param {Router}       router            The router
 * @param {AuthStrategy} basicAuthStrategy The auth strategy
 *
 * @return {Router}
 */
export function securityRoutes(router: Router, basicAuthStrategy: AuthStrategy): Router {
    router.put('/authorizations', asyncHandler(Authenticate.middleware(basicAuthStrategy)), asyncHandler(createToken));

    return router;
}
