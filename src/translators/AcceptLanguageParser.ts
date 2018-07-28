/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from "../utils/LooseObject";
import {AcceptLanguageItem} from './AcceptLanguageItem';
import {string} from "joi";

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AcceptLanguageParser
{
    private static regex: RegExp = /((([a-zA-Z]+(-[a-zA-Z0-9]+){0,2})|\*)(;q=[0-1](\.[0-9]+)?)?)*/g;

    /**
     * Parse the accept language of http header.
     *
     * @param {string} value The accept language
     */
    public static parse(value: string): LooseObject<AcceptLanguageItem> {
        let matches:any = (value || '').match(AcceptLanguageParser.regex);

        return matches.map((value?: string): AcceptLanguageItem|undefined => {
            if (!value) {
                return;
            }

            let bits = value.split(';');
            let ietf = bits[0].split('-');
            let hasScript = 3 === ietf.length;

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
}
