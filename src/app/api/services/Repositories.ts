/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from '../BaseService';
import {Canceler} from '../Canceler';
import {ListOptions} from '../models/requests/ListOptions';
import {CodeRepository} from '../models/responses/CodeRepository';
import {ListResponse} from '../models/responses/ListResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Repositories extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Repositories';
    }

    /**
     * Get or create the authorization.
     *
     * @param {ListOptions} [options]
     * @param {Canceler}    [canceler]
     *
     * @return {Promise<ListResponse<CodeRepository>>}
     */
    public async list(options?: ListOptions, canceler?: Canceler): Promise<ListResponse<CodeRepository>> {
        return this.requestList<CodeRepository>({
            url: '/manager/repositories', params: options || {},
        }, canceler);
    }
}
