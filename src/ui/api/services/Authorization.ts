/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from '@app/ui/api/BaseService';
import {AuthorizationRequest} from '@app/ui/api/models/requests/AuthorizationRequest';
import {AuthorizationResponse} from '@app/ui/api/models/responses/AuthorizationResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Authorization extends BaseService
{
    /**
     * Get or create the authorization.
     *
     * @param {AuthorizationRequest} credentials
     *
     * @return {Promise<AuthorizationResponse>}
     */
    public async get(credentials: AuthorizationRequest): Promise<AuthorizationResponse> {
        let res = await this.axios.put<AuthorizationResponse>('/authorizations', credentials, {auth: credentials});

        return res.data;
    }

    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Authorization';
    }
}
