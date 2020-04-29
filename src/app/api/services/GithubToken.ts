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
import {TokensResponse} from '../models/responses/tokens/TokensResponse';
import {TokenRequest} from '../models/requests/tokens/TokenRequest';
import {TokenResponse} from '../models/responses/tokens/TokenResponse';
import {TokenDeleteRequest} from '@app/api/models/requests/tokens/TokenDeleteRequest';
import {TokenDeleteResponse} from '../models/responses/tokens/TokenDeleteResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GithubToken extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'GithubToken';
    }

    /**
     * Get the Github tokens.
     *
     * @param {Canceler} [canceler]
     *
     * @return {Promise<TokensResponse|null>}
     */
    public async get(canceler?: Canceler): Promise<TokensResponse|null> {
        return await this.request<TokensResponse>({
            method: 'GET',
            url: '/manager/github-token',
        });
    }

    public async create(data: TokenRequest,
                        canceler?: Canceler): Promise<TokenResponse> {
        return await this.request<TokenResponse>({
            method: 'POST',
            url: '/manager/github-token',
            data,
        }, canceler) as TokenResponse;
    }

    public async delete(data: TokenDeleteRequest,
                        canceler?: Canceler): Promise<TokenDeleteResponse> {
        return await this.request<TokenDeleteResponse>({
            method: 'DELETE',
            url: '/manager/github-token',
            data,
        }, canceler) as TokenDeleteResponse;
    }
}
