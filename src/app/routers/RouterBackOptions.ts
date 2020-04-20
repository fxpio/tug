/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueRouter from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RouterBackOptions {
    router: VueRouter;
    forceHistory?: boolean;
}
