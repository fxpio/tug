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
import {GithubOauthTokensResponse} from '../models/responses/github/GithubOauthTokensResponse';
import {GithubOauthTokenRequest} from '../models/requests/github/GithubOauthTokenRequest';
import {GithubOauthTokenResponse} from '../models/responses/github/GithubOauthTokenResponse';
import {GithubOauthTokenDeleteRequest} from '../models/requests/github/GithubOauthTokenDeleteRequest';
import {GithubOauthTokenDeleteResponse} from '../models/responses/github/GithubOauthTokenDeleteResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GithubOauthToken extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'GithubOauthToken';
    }

    /**
     * Get the Github oAuth tokens.
     *
     * @param {Canceler} [canceler]
     *
     * @return {Promise<GithubOauthTokensResponse|null>}
     */
    public async get(canceler?: Canceler): Promise<GithubOauthTokensResponse | null> {
        return await this.request<GithubOauthTokensResponse>({
            method: 'GET',
            url: '/manager/github-oauth',
        });
    }

    public async create(data: GithubOauthTokenRequest,
                        canceler?: Canceler): Promise<GithubOauthTokenResponse> {
        return await this.request<GithubOauthTokenResponse>({
            method: 'POST',
            url: '/manager/github-oauth',
            data,
        }, canceler) as GithubOauthTokenResponse;
    }

    public async delete(data: GithubOauthTokenDeleteRequest,
                        canceler?: Canceler): Promise<GithubOauthTokenDeleteResponse> {
        return await this.request<GithubOauthTokenDeleteResponse>({
            method: 'DELETE',
            url: '/manager/github-oauth',
            data,
        }, canceler) as GithubOauthTokenDeleteResponse;
    }
}
