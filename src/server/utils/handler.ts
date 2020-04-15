/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Request, Response} from 'express';
import {RequestHandlerParams} from 'express-serve-static-core';

/**
 * Handler to catch the errors for the async function.
 *
 * @param {Function} fn The function
 *
 * @return {RequestHandlerParams}
 */
export function asyncHandler(fn: Function): RequestHandlerParams {
    return ((req: Request, res: Response, next: Function|any, ...args: any[]): Promise<Function> => {
        return Promise
            .resolve(fn(req, res, next, ...args))
            .catch(next);
    }) as RequestHandlerParams;
}
