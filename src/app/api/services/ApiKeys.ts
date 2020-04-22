/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from './../BaseService';
import {Canceler} from './../Canceler';
import {ListOptions} from './../models/requests/ListOptions';
import {ApiKey} from './../models/responses/ApiKey';
import {ListResponse} from './../models/responses/ListResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ApiKeys extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'ApiKeys';
    }

    /**
     * Get or create the authorization.
     *
     * @param {ListOptions} [options]
     * @param {Canceler}    [canceler]
     *
     * @return {Promise<ListResponse<ApiKey>>}
     */
    public async list(options?: ListOptions, canceler?: Canceler): Promise<ListResponse<ApiKey>> {
        return this.requestList<ApiKey>({url: '/manager/api-keys', params: options || {}}, canceler);
    }
}
