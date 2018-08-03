/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {I18nModuleState} from '@app/ui/stores/i18n/I18nModuleState';
import {I18nState} from '@app/ui/stores/i18n/I18nState';
import {Validator} from 'vee-validate';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Router from 'vue-router';
import {GetterTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class I18nModule<R extends I18nModuleState> implements Module<I18nState, R>
{
    private readonly router: Router;
    private readonly i18n: VueI18n;

    /**
     * Constructor.
     *
     * @param router The router
     * @param i18n   The router
     */
    public constructor(router: Router, i18n: VueI18n) {
        this.router = router;
        this.i18n = i18n;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): I18nState {
        return {
            locale: this.findLocale(),
            fallback: this.i18n.fallbackLocale
        };
    }

    public get getters(): GetterTree<I18nState, R> {
        return {
            getLocale(state: I18nState): string {
                return state.locale;
            },
            getLocaleFallback(state: I18nState): string {
                return state.fallback;
            },
        };
    }

    public get mutations(): MutationTree<I18nState> {
        let self = this;

        return {
            setLocale(state: I18nState, locale: string): void {
                let oldLocale = state.locale;
                locale = self.getAvailableLocale(locale) || self.i18n.locale;

                if (oldLocale === locale) {
                    return;
                }

                self.saveLocale(locale);
                state.locale = locale;
            },
        };
    }

    /**
     * Find locale.
     *
     * @return {string}
     */
    private findLocale(): string {
        let locale = localStorage.getItem('i18n:locale');

        if (null === locale && window.navigator) {
            let availables = window.navigator.languages;

            for (let i = 0; i < availables.length; ++i) {
                let availableLocale = this.getAvailableLocale(availables[i]);

                if (availableLocale) {
                    locale = availableLocale;
                    break;
                }
            }
        }

        return this.saveLocale(locale || this.i18n.locale);
    }

    /**
     * Get the available locale.
     *
     * @param {string|null} locale
     *
     * @return {string|null}
     */
    private getAvailableLocale(locale: string|null): string|null {
        if (locale) {
            if (this.i18n.messages[locale]) {
                return locale;
            } else if (locale.indexOf('-') > 0) {
                locale = locale.substring(0, locale.indexOf('-'));

                if (this.i18n.messages[locale]) {
                    return locale;
                }
            }
        }

        return null;
    }

    /**
     * Save and inject the locale.
     *
     * @param {string} locale
     *
     * @return {string}
     */
    private saveLocale(locale: string): string {
        localStorage.setItem('i18n:locale', locale);
        this.i18n.locale = locale;
        Validator.localize(locale);
        Vue.prototype.$vuetify.lang.current = locale;

        return locale;
    }
}
