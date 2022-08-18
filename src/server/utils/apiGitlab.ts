/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Request} from 'express';

/**
 * Check if the request is a Gitlab event.
 *
 * @param {Request} req
 *
 * @return {boolean}
 */
export function isGitlabEvent(req: Request): boolean {
    return req.headers.hasOwnProperty('x-gitlab-event');
}

/**
 * Get the request is a Gitlab event.
 *
 * @param {Request} req
 *
 * @return {string|null}
 */
export function getGitlabEvent(req: Request): string|null {
    if (isGitlabEvent(req)) {
        let val = req.headers['x-gitlab-event'];

        if (val instanceof Array && val.length > 0) {
            val = val[0];
        }

        if (typeof val === 'string') {
            return val;
        }
    }

    return null;
}
