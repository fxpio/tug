/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Quote regular expression characters
 *
 * @param {string} str         The string
 * @param {string} [delimiter] The delimiter
 *
 * @return {string}
 */
export function pregQuote(str: string, delimiter?: string): string {
    return (str + '')
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}
