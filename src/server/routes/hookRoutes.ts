/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {githubHook} from '@server/controllers/hooks/githubController';
import {queueHook} from '@server/controllers/hooks/queueController';
import {Authenticate} from '@server/middlewares/auth/Authenticate';
import {GithubWebhookAuth} from '@server/middlewares/auth/strategies/GithubWebhookAuth';
import {QueueAuth} from '@server/middlewares/auth/strategies/QueueAuth';
import {asyncHandler} from '@server/utils/handler';
import {Router} from 'express';

/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export function hookRoutes(router: Router): Router {
    router.post('/', asyncHandler(Authenticate.middleware(new GithubWebhookAuth(), true)), asyncHandler(githubHook));
    router.get('/', asyncHandler(Authenticate.middleware(new QueueAuth(), true)), asyncHandler(queueHook));

    return router;
}
