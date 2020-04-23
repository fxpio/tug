/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpUnauthorizedError} from '@server/errors/HttpUnauthorizedError';
import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {Request, Response} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Authenticate {
    /**
     * Create the express middleware.
     *
     * @param {AuthStrategy} strategy    The strategy
     * @param {boolean}      [nextRoute] Define if the next route must be called or not
     *
     * @return {Function}
     */
    public static middleware(strategy: AuthStrategy, nextRoute: boolean = false): Function {
        return async (req: Request, res: Response, next: Function): Promise<void> => {
            if (await strategy.logIn(req)) {
                next();
            } else if (nextRoute) {
                next('route');
            } else {
                throw new HttpUnauthorizedError();
            }
        };
    }
}
