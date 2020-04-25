/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Request, Response} from 'express';
import {getRedirectAppPath} from '@server/utils/ui';

/**
 * Redirect to the home page.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function redirectHome(req: Request, res: Response, next: Function): Promise<void> {
    let reqPath = req.app.get('request-context-path');
    reqPath = reqPath ? reqPath : req.path;

    res.redirect(getRedirectAppPath(req.app.get('app-base-path'), reqPath));
}
