/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import Router from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '',
            redirect: {name: 'home'},
        },
        {
            path: '/home',
            name: 'home',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "home" */ '@app/views/Home.vue'),
            },
        },
        {
            path: '/repositories',
            name: 'repositories',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "repositories" */ '@app/views/repositories/Repositories.vue'),
                toolbar: () => import(/* webpackChunkName: "repositories" */'@app/components/SearchToolbar.vue'),
            },
        },
        {
            path: '/redirect/repositories-add',
            name: 'repositories-add-redirect',
            redirect: {name: 'repositories-add'},
        },
        {
            path: '/repositories/add',
            name: 'repositories-add',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "repositories" */ '@app/views/repositories/RepositoryAdd.vue'),
            },
        },
        {
            path: '/repositories/p/:id',
            name: 'repositories-package',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "repositories" */ '@app/views/repositories/RepositoryView.vue'),
                toolbar: () => import(/* webpackChunkName: "repositories" */'@app/components/SearchToolbar.vue'),
            },
        },
        {
            path: '/api-keys',
            name: 'api-keys',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "api-keys" */ '@app/views/api-keys/ApiKeys.vue'),
                toolbar: () => import(/* webpackChunkName: "api-keys" */'@app/components/SearchToolbar.vue'),
            },
        },
        {
            path: '/redirect/api-keys-add',
            name: 'api-keys-add-redirect',
            redirect: {name: 'api-keys-add'},
        },
        {
            path: '/api-keys/add',
            name: 'api-keys-add',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "api-keys" */ '@app/views/api-keys/ApiKeyAdd.vue'),
            },
        },
        {
            path: '/settings',
            name: 'settings',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "settings" */ '@app/views/Settings.vue'),
            },
        },
        {
            path: '/about',
            name: 'about',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "about" */ '@app/views/About.vue'),
            },
        },
        {
            path: '/login',
            name: 'login',
            components: {
                default: () => import(/* webpackChunkName: "login" */ '@app/views/Login.vue'),
            },
        },
        {
            path: '*',
            name: 'not-found',
            components: {
                default: () => import('@app/views/NotFound.vue'),
            },
        },
    ],
});
