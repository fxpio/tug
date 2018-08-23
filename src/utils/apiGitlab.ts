
import {Request} from 'express';
/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the request is a Gitlab event.
 *
 * @param {IncomingMessage} req
 *
 * @return {boolean}
 */
export function isGitlabEvent(req: Request): boolean {
    return req.hasOwnProperty('headers') && req.headers.hasOwnProperty('x-gitlab-event');
}

/**
 * Get the request is a Gitlab event.
 *
 * @param {IncomingMessage} req
 *
 * @return {String|null}
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
