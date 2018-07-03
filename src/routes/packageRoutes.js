/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Authenticate from '../middleware/auth/Authenticate';
import BasicToken from '../middleware/auth/strategies/BasicToken';

/**
 * Generate the routes.
 *
 * @param {Router} router  The router
 * @param {Object} storage The storage
 *
 * @return {Router}
 */
export default function packageRoutes(router, storage) {
    router.use(new Authenticate(new BasicToken(storage)));

    return router;
}
