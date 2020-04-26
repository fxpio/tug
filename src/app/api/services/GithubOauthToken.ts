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
import {GithubOauthTokenResponse} from '../models/responses/github/GithubOauthTokenResponse';
import {GithubOauthTokenRequest} from '../models/requests/github/GithubOauthTokenRequest';
import {MessageResponse} from '../models/responses/MessageResponse';
import {GithubOauthTokenDeleteRequest} from '../models/requests/github/GithubOauthTokenDeleteRequest';

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
     * @return {Promise<GithubOauthTokenResponse|null>}
     */
    public async get(canceler?: Canceler): Promise<GithubOauthTokenResponse | null> {
        return await this.request<GithubOauthTokenResponse>({
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
                        canceler?: Canceler): Promise<MessageResponse> {
        return await this.request<GithubOauthTokenResponse>({
            method: 'DELETE',
            url: '/manager/github-oauth',
            data,
        }, canceler) as GithubOauthTokenResponse;
    }
}
