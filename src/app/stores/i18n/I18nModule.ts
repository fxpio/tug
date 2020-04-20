/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {I18nModuleState} from './I18nModuleState';
import {I18nState} from './I18nState';
import moment from 'moment';
import {Validator} from 'vee-validate';
import VueI18n from 'vue-i18n';
import {GetterTree, Module, MutationTree} from 'vuex';
import vuetify from '@app/plugins/vuetify';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class I18nModule<R extends I18nModuleState> implements Module<I18nState, R> {
    private readonly i18n: VueI18n;

    private readonly storage: Storage;

    /**
     * Constructor.
     */
    public constructor(i18n: VueI18n, storage?: Storage) {
        this.i18n = i18n;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): I18nState {
        return {
            locale: this.findLocale(),
            fallback: this.i18n.fallbackLocale as string,
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
        const self = this;

        return {
            setLocale(state: I18nState, locale: string): void {
                const oldLocale = state.locale;
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
        let locale = this.storage.getItem('i18n:locale');

        if (null === locale && window.navigator) {
            const availables: any = window.navigator.languages;

            for (const available of availables) {
                const availableLocale = this.getAvailableLocale(available);

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
    private getAvailableLocale(locale: string | null): string | null {
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
        this.storage.setItem('i18n:locale', locale);
        this.i18n.locale = locale;
        Validator.localize(locale);
        vuetify.framework.lang.current = locale;
        moment.locale(locale);

        return locale;
    }
}
