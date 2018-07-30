/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AcceptLanguageParser} from '@app/translators/AcceptLanguageParser';
import {Translator} from '@app/translators/Translator';
import {TranslatorTranslation} from '@app/translators/TranslatorTranslation';
import {TranslatorTranslations} from '@app/translators/TranslatorTranslations';
import {LooseObject} from '@app/utils/LooseObject';
import {Request, Response} from 'express';
import Polyglot from 'node-polyglot';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class PolyglotTranslator implements Translator
{
    private fallbackLocale: string;

    private readonly translations: LooseObject<Polyglot>;

    /**
     * Constructor.
     *
     * @param {string}   [fallbackLocale] The fallback locale
     * @param {Polyglot} [translations]   The polyglot
     */
    constructor(fallbackLocale: string = 'en', translations: TranslatorTranslations = {}) {
        this.fallbackLocale = PolyglotTranslator.formatLocale(fallbackLocale);
        this.translations = {};

        for (let locale of Object.keys(translations)) {
            this.addTranslation(locale, translations[locale]);
        }
    }

    /**
     * @inheritDoc
     */
    public setLocale(res: Response, locale: string): void {
        res.locals.locale = PolyglotTranslator.formatLocale(locale);
    }

    /**
     * @inheritDoc
     */
    public setLocaleByRequest(res: Response, req: Request): void {
        let acceptLanguage = req.header('accept-language');
        let isFound = false;

        if (acceptLanguage) {
            let acceptLanguages = AcceptLanguageParser.parse(acceptLanguage);
            for (let i of Object.keys(acceptLanguages)) {
                let name = acceptLanguages[i].name;

                if (this.hasTranslation(name)) {
                    this.setLocale(res, name);
                    isFound = true;
                    break;
                } else if (name.indexOf('-') > 0) {
                    name = name.substring(0, name.indexOf('-'));

                    if (this.hasTranslation(name)) {
                        this.setLocale(res, name);
                        isFound = true;
                        break;
                    }
                }
            }
        }

        if (!isFound) {
            this.setLocale(res, this.fallbackLocale);
        }
    }

    /**
     * @inheritDoc
     */
    public getLocale(res?: Response): string {
        return res && res.locals.locale ? res.locals.locale : this.fallbackLocale;
    }

    /**
     * @inheritDoc
     */
    public setFallbackLocale(locale: string): void {
        this.fallbackLocale = PolyglotTranslator.formatLocale(locale);
    }

    /**
     * @inheritDoc
     */
    public getFallbackLocale(): string {
        return this.fallbackLocale;
    }

    /**
     * @inheritDoc
     */
    public addTranslation(locale: string, translations: TranslatorTranslation): void {
        locale = PolyglotTranslator.formatLocale(locale);

        if (!this.translations[locale]) {
            this.translations[locale] = new Polyglot({locale: locale, interpolation: {prefix: '{{', suffix: '}}'}});
        }

        this.translations[locale].extend(translations);
    }

    /**
     * @inheritDoc
     */
    public hasTranslation(locale: string): boolean {
        return !!this.translations[PolyglotTranslator.formatLocale(locale)];
    }

    /**
     * @inheritDoc
     */
    public trans(res: Response, key: string, parameters?: LooseObject<string>, locale?: string): string {
        let value = key;
        locale = locale ? PolyglotTranslator.formatLocale(locale) : this.getLocale(res);

        if (this.translations[locale] && this.translations[locale].has(key)) {
            return this.translations[locale].t(key, parameters as Polyglot.InterpolationOptions);
        }

        if (locale.indexOf('-') > 0) {
            locale = locale.substring(0, locale.indexOf('-'));

            if (this.translations[locale] && this.translations[locale].has(key)) {
                return this.translations[locale].t(key, parameters as Polyglot.InterpolationOptions);
            }
        }

        locale = this.fallbackLocale;

        if (this.translations[locale] && this.translations[locale].has(key)) {
            return this.translations[locale].t(key, parameters as Polyglot.InterpolationOptions);
        }

        if (locale.indexOf('-') > 0) {
            locale = locale.substring(0, locale.indexOf('-'));

            if (this.translations[locale] && this.translations[locale].has(key)) {
                return this.translations[locale].t(key, parameters as Polyglot.InterpolationOptions);
            }
        }

        return value;
    }

    /**
     * Format the locale.
     *
     * @param {string} locale The locale.
     *
     * @return {string}
     */
    private static formatLocale(locale: string): string {
        return locale.toLowerCase().replace(/_/g, '-');
    }
}
