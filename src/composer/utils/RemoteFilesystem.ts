/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import merge from 'lodash.merge';
import fetch, {Response} from 'node-fetch';
import {Config} from '@app/configs/Config';
import {TransportError} from '@app/errors/TransportError';
import {TransportResourceNotFoundError} from '@app/errors/TransportResourceNotFoundError';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RemoteFilesystem
{
    private config: Config;
    private lastHeaders: Object;

    /**
     * Constructor.
     *
     * @param {Config} config
     */
    constructor(config: Config) {
        this.config = config;
        this.lastHeaders = {};
    }

    /**
     * Get the content.
     *
     * @param {string} originalUrl The original url
     * @param {string} fileUrl     The file url
     * @param {Object} options     The fetch options
     *
     * @return {Promise<string>}
     *
     * @throws TransportError When fetch throws an error or the response is not a status code 200
     */
    public async get(originalUrl: string, fileUrl: string, options: Object = {}): Promise<string> {
        let params: LooseObject = {
            headers: {},
        };

        if (this.config.get('github-domains').includes(originalUrl)) {
            params.headers['Content-Type'] = 'application/json';
            params.headers['Authorization'] = 'token ' + this.config.get('github-oauth[' + originalUrl + ']');
        }

        options = merge(options, params);

        return await fetch(fileUrl, options)
            .then(async (res: Response) => {
                this.lastHeaders = res.headers.raw();

                if (200 === res.status) {
                    return await res.text();
                }

                throw new TransportResourceNotFoundError(fileUrl, res.status);
            })
            .catch((e: Error) => {
                this.lastHeaders = {};
                if (!(e instanceof TransportError)) {
                    e = new TransportError(e.message);
                }

                throw e;
            });
    }

    /**
     * Get the headers of the last request.
     *
     * @return {Object}
     */
    public getLastHeaders(): Object {
        return this.lastHeaders;
    }
}
