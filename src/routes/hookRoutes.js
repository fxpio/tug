/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Authenticate from '../middlewares/auth/Authenticate';
import GithubWebhookAuth from '../middlewares/auth/strategies/GithubWebhookAuth';
import GitlabWebhookAuth from '../middlewares/auth/strategies/GitlabWebhookAuth';
import QueueAuth from '../middlewares/auth/strategies/QueueAuth';
import {asyncHandler} from '../utils/handler';
import {githubHook} from '../controllers/hooks/githubController';
import {gitlabHook} from '../controllers/hooks/gitlabController';
import {queueHook} from '../controllers/hooks/queueController';

/**
 * Generate the routes.
 *
 * @param {Router} router The router
 *
 * @return {Router}
 */
export default function(router) {
    router.post('/', asyncHandler(new Authenticate(new GithubWebhookAuth(), true)), asyncHandler(githubHook));
    router.post('/gitlab-hook', asyncHandler(new Authenticate(new GitlabWebhookAuth(), true)), asyncHandler(gitlabHook));
    router.get('/', asyncHandler(new Authenticate(new QueueAuth(), true)), asyncHandler(queueHook));

    return router;
}
