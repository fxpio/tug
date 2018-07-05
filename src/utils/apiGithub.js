/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the request is a Github event.
 *
 * @param {IncomingMessage} req
 *
 * @return {boolean}
 */
export function isGithubEvent(req) {
    return req.headers && req.headers['x-github-event'];
}

/**
 * Get the request is a Github event.
 *
 * @param {IncomingMessage} req
 *
 * @return {String|null}
 */
export function getGithubEvent(req) {
    if (isGithubEvent(req)) {
        return req.headers['x-github-event'];
    }

    return null;
}
