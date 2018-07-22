/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the server is in prod mode
 *
 * @return {boolean}
 */
export function isProd(): boolean {
    return 'production' === process.env.NODE_ENV;
}
