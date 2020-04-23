/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AcceptLanguageItem} from '@server/translators/AcceptLanguageItem';
import {LooseObject} from '@server/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AcceptLanguageParser {

    /**
     * Parse the accept language of http header.
     *
     * @param {string} value The accept language
     */
    public static parse(value: string): LooseObject<AcceptLanguageItem> {
        const matches: any = (value || '').match(AcceptLanguageParser.regex);

        return matches.map((value?: string): AcceptLanguageItem|undefined => {
            if (!value) {
                return;
            }

            const bits = value.split(';');
            const ietf = bits[0].split('-');
            const hasScript = 3 === ietf.length;

            return new AcceptLanguageItem(ietf[0],
                hasScript ? ietf[1] : undefined,
                hasScript ? ietf[2] : ietf[1],
                bits[1] ? parseFloat(bits[1].split('=')[1]) : undefined);
        }).filter((item?: AcceptLanguageItem): AcceptLanguageItem|undefined => {
            return item;
        }).sort((a: AcceptLanguageItem, b: AcceptLanguageItem): number => {
            return b.quality - a.quality;
        });
    }

    private static regex: RegExp = /((([a-zA-Z]+(-[a-zA-Z0-9]+){0,2})|\*)(;q=[0-1](\.[0-9]+)?)?)*/g;
}
