/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {githubHook} from '@app/controllers/hooks/githubController';
import {queueHook} from '@app/controllers/hooks/queueController';
import GitlabWebhookAuth from '../middlewares/auth/strategies/GitlabWebhookAuth';
import {Authenticate} from '@app/middlewares/auth/Authenticate';
import {GithubWebhookAuth} from '@app/middlewares/auth/strategies/GithubWebhookAuth';
import {QueueAuth} from '@app/middlewares/auth/strategies/QueueAuth';
import {asyncHandler} from '@app/utils/handler';
import {Router} from 'express';
import { gitlabHook } from '../controllers/hooks/gitlabController';


/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export function hookRoutes(router: Router): Router {
    router.post('/', asyncHandler(Authenticate.middleware(new GithubWebhookAuth(), true)), asyncHandler(githubHook));
    router.post('/gitlab', asyncHandler(Authenticate.middleware(new GitlabWebhookAuth(), true)), asyncHandler(gitlabHook));
    router.get('/', asyncHandler(Authenticate.middleware(new QueueAuth(), true)), asyncHandler(queueHook));

    return router;
}
