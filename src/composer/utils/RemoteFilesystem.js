/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import merge from 'lodash.merge';
import Config from '../../configs/Config';
import fetch from "node-fetch";
import TransportError from "../../errors/TransportError";

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RemoteFilesystem
{
    /**
     * Constructor.
     *
     * @param {Config} config
     */
    constructor(config) {
        this.config = config;
        this.lastHeaders = {};
    }

    /**
     * Get the content.
     *
     * @param {String} originalUrl The original url
     * @param {String} fileUrl     The file url
     * @param {Object} options     The fetch options
     *
     * @return {Promise<String>}
     *
     * @throws TransportError When fetch throws an error or the response is not a status code 200
     */
    async get(originalUrl, fileUrl, options = {}) {
        let params = {
            headers: {},
        };

        if (this.config.get('github-domains').includes(originalUrl)) {
            params.headers['Content-Type'] = 'application/json';
            params.headers['Authorization'] = 'token ' + this.config.get('github-oauth[' + originalUrl + ']');
        }
        if (this.config.get('gitlab-domains').includes(originalUrl)) {
            params.headers['Content-Type'] = 'application/json';
            params.headers['Private-Token'] = this.config.get('gitlab-access-token[' + originalUrl + ']');
        }

        options = merge(options, params);

        return await fetch(fileUrl, options)
            .then(async res => {
                this.lastHeaders = res.headers.raw();

                if (200 === res.status) {
                    return await res.text();
                }

                throw new TransportError(`The "${fileUrl}" file could not be downloaded`, res.status);
            })
            .catch(e => {
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
    getLastHeaders() {
        return this.lastHeaders;
    }
}
