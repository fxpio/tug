/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Authenticate
{
    /**
     * Constructor.
     *
     * @param {AuthStrategy} strategy    The strategy
     * @param {Boolean}      [nextRoute] Define if the next route must be called or not
     *
     * @return {Function}
     */
    constructor(strategy, nextRoute = false) {
        return async function (req, res, next) {
            if (await strategy.logIn(req)) {
                next();
            } else if (nextRoute) {
                next('route');
            } else {
                res.status(401).send();
            }
        }
    }
}
