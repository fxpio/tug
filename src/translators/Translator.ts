/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Request, Response} from 'express';
import {TranslatorTranslation} from './TranslatorTranslation';
import {LooseObject} from '../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface Translator
{
    /**
     * Set the locale.
     *
     * @param {Response} res    The response
     * @param {string}   locale The locale
     */
    setLocale(res: Response, locale: string): void;

    /**
     * Set the locale by accept language http header in request.
     *
     * @param {Response} res The response
     * @param {Request}  req The request
     */
    setLocaleByRequest(res: Response, req: Request): void;

    /**
     * Get the locale.
     *
     * @param {Response} [res] The response
     *
     * @return {string}
     */
    getLocale(res?: Response): string;

    /**
     * Set the fallback locale.
     *
     * @param {string} locale The locale
     */
    setFallbackLocale(locale: string): void;

    /**
     * Get the fallback locale.
     *
     * @return {string}
     */
    getFallbackLocale(): string;

    /**
     * Add the translation.
     *
     * @param {string}                locale       The locale
     * @param {TranslatorTranslation} translations The translations for the locale
     */
    addTranslation(locale: string, translations: TranslatorTranslation): void;

    /**
     * Check if the translation for the locale is defined.
     *
     * @param {string} locale The locale
     *
     * @return {boolean}
     */
    hasTranslation(locale: string): boolean;

    /**
     * Check if the storage has the key.
     *
     * @param {Response} res        The response
     * @param {string}   key        The key
     * @param {object}   parameters The parameters
     * @param {string}   [locale]   The locale to used for the translation
     *
     * @return {string}
     */
    trans(res: Response, key: string, parameters?: LooseObject<string>, locale?: string): string;
}
