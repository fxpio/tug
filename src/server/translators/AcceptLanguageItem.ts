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
export class AcceptLanguageItem {
    public readonly name: string;
    public readonly code: string;
    public readonly script: string|null;
    public readonly region: string|null;
    public readonly quality: number;

    /**
     * Constructor.
     *
     * @param {string} code
     * @param {string} [script]
     * @param {string} [region]
     * @param {number} [quality]
     */
    public constructor(code: string, script?: string, region?: string, quality?: number) {
        this.code = code.toLowerCase();
        this.script = script ? script.toLowerCase() : null;
        this.region = region ? region.toLowerCase() : null;
        this.quality = quality ? quality : 1.0;
        this.name = this.code + (this.script ? `-${this.script}` : '') + (this.region ? `-${this.region}` : '');
    }
}
