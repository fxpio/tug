/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';

/**
 * Date formatter.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class CurrencyFormatter {
    public static format(vm: Vue, value: number, currency?: string): string {
        if (!currency && vm.$store.state && vm.$store.state.edition && vm.$store.state.edition.current) {
            currency = vm.$store.state.edition.current.currency;
        }

        const locale = vm.$store.state.i18n ? vm.$store.state.i18n.locale : undefined;

        return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(value);
    }
}
