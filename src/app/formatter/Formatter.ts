/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';
import VueI18n from 'vue-i18n';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Formatter {
    private i18n?: VueI18n;

    public setI18n(i18n?: VueI18n): void {
        this.i18n = i18n;
    }

    public date(value?: string, format?: string): string|undefined {
        format = format ? format : 'L';

        return this.dateTime(value, format);
    }

    public time(value?: string, format?: string): string|undefined {
        format = format ? format : 'LTS';

        return this.dateTime(value, format);
    }

    public dateTime(value?: string, format?: string): string|undefined {
        format = format ? format : 'L LTS';

        if (this.i18n) {
            moment.locale(this.i18n.locale);
        }

        return value ? moment(value).format(format) : undefined;
    }
}
