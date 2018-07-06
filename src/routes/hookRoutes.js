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
import QueueAuth from '../middlewares/auth/strategies/QueueAuth';
import {githubHook} from '../controllers/githubHooks';
import {queueHook} from '../controllers/queueHooks';

/**
 * Generate the routes.
 *
 * @param {Router}      router  The router
 * @param {DataStorage} storage The storage
 *
 * @return {Router}
 */
export default function(router, storage) {
    router.post('/', new Authenticate(new GithubWebhookAuth(storage)), githubHook);
    router.get('/', new Authenticate(new QueueAuth()), queueHook);

    return router;
}