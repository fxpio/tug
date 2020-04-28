/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiServiceNotFoundError} from './errors/ApiServiceNotFoundError';
import {ApiService, ApiServiceConstructor} from './ApiService';
import {Authorization} from './services/Authorization';
import {ApiKeys} from './services/ApiKeys';
import {Repositories} from './services/Repositories';
import {GithubOauthToken} from './services/GithubOauthToken';

const SERVICES: ApiServiceConstructor[] = [
    Authorization,
    ApiKeys,
    Repositories,
    GithubOauthToken,
];

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Api {
    private readonly axios: AxiosInstance;

    private readonly services: ApiServices;

    /**
     * Constructor.
     *
     * @param {string}                  baseUrl    The base url
     * @param {ApiServiceConstructor[]} [services] The api services
     */
    constructor(baseUrl: string, services?: ApiServiceConstructor[]) {
        this.axios = axios.create({
            baseURL: baseUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        this.services = {};
        services = services ? services : SERVICES;

        for (const service of services) {
            this.add(service);
        }
    }

    /**
     * Add the api service.
     *
     * @param {ApiServiceConstructor} service The api service
     */
    public add(service: ApiServiceConstructor): void {
        if (typeof service === 'function' && service.getName()) {
            this.services[service.getName()] = new service(this.axios);
        }
    }

    /**
     * Get the api service.
     *
     * @param {ApiServiceConstructor|string} service The api service
     *
     * @return {ApiService}
     */
    public get<T extends ApiService>(service: ApiServiceConstructor | string): T {
        let name = null;

        if (typeof service === 'string') {
            name = service;
        } else if (service.hasOwnProperty('getName')) {
            name = (service as ApiServiceConstructor).getName();
        } else {
            throw new ApiServiceNotFoundError(service);
        }

        if (!this.services[name]) {
            throw new ApiServiceNotFoundError(name);
        }

        return this.services[name] as T;
    }

    /**
     * Add a request interceptor.
     *
     * @param {(value: AxiosRequestConfig) => (AxiosRequestConfig|Promise<AxiosRequestConfig>)} onFulfilled
     * @param {(error: any) => any}                                                             onRejected
     *
     * @return {number}
     */
    public addRequestInterceptor(onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>, onRejected?: (error: any) => any): number {
        return this.axios.interceptors.request.use(onFulfilled, onRejected);
    }

    /**
     * Add response interceptor.
     *
     * @param {(value: AxiosResponse) => (AxiosResponse|Promise<AxiosResponse>)} onFulfilled
     * @param {(error: any) => any}                                              onRejected
     *
     * @return {number}
     */
    public addResponseInterceptor(onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>, onRejected?: (error: any) => any): number {
        return this.axios.interceptors.response.use(onFulfilled, onRejected);
    }
}

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
interface ApiServices {
    [key: string]: ApiService;
}
