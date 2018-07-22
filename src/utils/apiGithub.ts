/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Request} from 'express';

/**
 * Check if the request is a Github event.
 *
 * @param {Request} req
 *
 * @return {boolean}
 */
export function isGithubEvent(req: Request): boolean {
    return req.hasOwnProperty('headers') && req.headers.hasOwnProperty('x-github-event');
}

/**
 * Get the request is a Github event.
 *
 * @param {Request} req
 *
 * @return {string|null}
 */
export function getGithubEvent(req: Request): string|null {
    if (isGithubEvent(req)) {
        let val = req.headers['x-github-event'];

        if (val instanceof Array && val.length > 0) {
            val = val[0];
        }

        if (typeof val === 'string') {
            return val;
        }
    }

    return null;
}
