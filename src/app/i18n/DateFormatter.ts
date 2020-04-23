/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';

/**
 * Date formatter.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DateFormatter {
    public static format(date: string | number,
                         format: string = 'L',
                         inputFormat: string = 'YYYYMMDD'): string {
        if (typeof date === 'number') {
            return moment.unix(date).format(format);
        }

        return moment(date, inputFormat).format(format);
    }
}
