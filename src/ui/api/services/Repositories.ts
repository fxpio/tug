/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from '@app/ui/api/BaseService';
import {Canceler} from '@app/ui/api/Canceler';
import {ListOptions} from '@app/ui/api/models/requests/ListOptions';
import {CodeRepository} from '@app/ui/api/models/responses/CodeRepository';
import {ListResponse} from '@app/ui/api/models/responses/ListResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Repositories extends BaseService
{
    /**
     * Get or create the authorization.
     *
     * @param {ListOptions} [options]
     * @param {Canceler}    [canceler]
     *
     * @return {Promise<ListResponse<CodeRepository>>}
     */
    public async list(options?: ListOptions, canceler?: Canceler): Promise<ListResponse<CodeRepository>> {
        return this.requestList<CodeRepository>({url: '/manager/repositories', params: options || {}}, canceler);
    }

    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Repositories';
    }
}
