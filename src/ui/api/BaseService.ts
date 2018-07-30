/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ApiService} from '@app/ui/api/ApiService';
import {AxiosInstance} from 'axios';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BaseService implements ApiService
{
    protected readonly axios: AxiosInstance;

    /**
     * Constructor.
     *
     * @param {AxiosInstance} axios
     */
    constructor(axios: AxiosInstance) {
        this.axios = axios;
    }
}
