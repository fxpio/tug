/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Format date to RFC 3339.
 *
 * @param {Date} date The date
 *
 * @return {string}
 */
export function dateToRfc3339(date: Date): string {
    function pad(n: number) {
        return n < 10 ? '0' + n : n;
    }

    return date.getUTCFullYear() + '-'
        + pad(date.getUTCMonth() + 1) + '-'
        + pad(date.getUTCDate()) + 'T'
        + pad(date.getUTCHours()) + ':'
        + pad(date.getUTCMinutes()) + ':'
        + pad(date.getUTCSeconds()) + '+00:00';
}
