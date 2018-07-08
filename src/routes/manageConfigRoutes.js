/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Authenticate from '../middlewares/auth/Authenticate';
import BasicIamAuth from '../middlewares/auth/strategies/BasicIamAuth';
import {asyncHandler} from '../utils/handler';
import {
    createApiKey,
    createGithubToken,
    deleteApiKey,
    deleteGithubToken,
    disableRepository,
    enableRepository,
    showGithubToken
} from '../controllers/manageConfigs';

/**
 * Generate the routes.
 *
 * @param {Router}  router The router
 * @param {boolean} debug  The debug mode
 *
 * @return {Router}
 */
export default function(router, debug) {
    router.use(asyncHandler(new Authenticate(new BasicIamAuth(debug))));

    router.post('/api-keys', asyncHandler(createApiKey));
    router.delete('/api-keys', asyncHandler(deleteApiKey));

    router.post('/github-token', asyncHandler(createGithubToken));
    router.get('/github-token', asyncHandler(showGithubToken));
    router.delete('/github-token', asyncHandler(deleteGithubToken));

    router.post('/repositories', asyncHandler(enableRepository));
    router.delete('/repositories', asyncHandler(disableRepository));

    return router;
}
