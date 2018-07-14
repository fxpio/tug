/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Handler to catch the errors for the async function.
 *
 * @param {Function} fn The function
 *
 * @return {Function}
 */
export function asyncHandler(fn) {
    return function (req, res, next, ...args) {
        return Promise
            .resolve(fn(req, res, next, ...args))
            .catch(next);
    };
}
