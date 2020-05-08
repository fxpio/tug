/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class FetchRequestDataEvent {
    public lastId: string | null = null;

    public search: string|null = null;

    public canceler?: Canceler;
}
