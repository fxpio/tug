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
     * @param {AuthStrategy} strategy The strategy
     *
     * @return {Function}
     */
    constructor(strategy) {
        return async function (req, res, next) {
            if (!await strategy.logIn(req, res, next)) {
                res.status(401).send();
            }
        }
    }
}
