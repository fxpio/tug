/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueI18nExtra from '@app/i18n/VueI18nExtra';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import translationEn from '@app/translations/en';
import translationFr from '@app/translations/fr';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(VueI18n);
Vue.use(VueI18nExtra);

export default new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    missing: (locale, key) => {
        console.warn(`I18n :: Key "${key}" is missing for locale "${locale}"`);
    },
    messages: {
        en: translationEn,
        fr: translationFr,
    },
});
