/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import crypto from 'crypto';

/**
 * Create the hash of content.
 *
 * @param {string} content   The content
 * @param {string} algorithm The algorithm
 *
 * @return {string}
 */
export function createHash(content: string, algorithm?: string): string {
    const hashHash = crypto.createHash(algorithm ? algorithm : 'sha1');
    hashHash.update(content);

    return hashHash.digest('hex');
}
