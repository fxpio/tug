/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@app/api/Canceler';
import {BaseService} from '@app/api/BaseService';
import {AuthorizationRequest} from '@app/api/models/requests/AuthorizationRequest';
import {AuthorizationResponse} from '@app/api/models/responses/AuthorizationResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Authorization extends BaseService
{
    /**
     * Get or create the authorization.
     *
     * @param {AuthorizationRequest} credentials
     * @param {Canceler}             [canceler]
     *
     * @return {Promise<AuthorizationResponse|null>}
     */
    public async get(credentials: AuthorizationRequest, canceler?: Canceler): Promise<AuthorizationResponse|null> {
        return await this.request<AuthorizationResponse>({
            method: 'PUT',
            url: '/authorizations',
            auth: credentials,
            data: credentials
        });
    }

    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Authorization';
    }
}
