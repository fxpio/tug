/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class MessageUtil {
    public static replace(message: boolean|string, values?: object|any): boolean|string {
        if (typeof message === 'string') {
            const matches = message.matchAll(new RegExp(`\\$\{ ?([a-zA-Z0-9]+) ?\}`, 'g'));
            values = values || {};

            for (const match of matches) {
                message = message.replace(match[0], values[match[1]] || '');
            }
        }

        return message;
    }
}
