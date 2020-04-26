/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '../Canceler';
import {BaseService} from '../BaseService';
import {AuthorizationRequest} from '../models/requests/AuthorizationRequest';
import {AuthorizationResponse} from '../models/responses/AuthorizationResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Authorization extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Authorization';
    }

    /**
     * Get or create the authorization.
     *
     * @param {AuthorizationRequest} credentials
     * @param {Canceler}             [canceler]
     *
     * @return {Promise<AuthorizationResponse|null>}
     */
    public async get(credentials: AuthorizationRequest, canceler?: Canceler): Promise<AuthorizationResponse | null> {
        return await this.request<AuthorizationResponse>({
            method: 'PUT',
            url: '/authorizations',
            auth: credentials,
            data: credentials,
        });
    }
}
