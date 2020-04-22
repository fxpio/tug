/*
 * This file is part of the Fxp Satis Serverless package.
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
    base: '/admin',
    routes: [
        {
            path: '',
            redirect: 'home',
        },
        {
            path: '/home',
            name: 'home',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "home" */ '@app/views/Home.vue'),
                toolbar: () => import(/* webpackChunkName: "home" */'@app/components/Toolbar.vue'),
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
            path: '/repositories/add',
            name: 'repositories-add',
            redirect: 'home',
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
            path: '/api-keys/add',
            name: 'api-keys-add',
            redirect: 'home',
        },
        {
            path: '/settings',
            name: 'settings',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "settings" */ '@app/views/Settings.vue'),
                toolbar: () => import(/* webpackChunkName: "settings" */'@app/components/Toolbar.vue'),
            },
        },
        {
            path: '/about',
            name: 'about',
            meta: {requiresAuth: true},
            components: {
                default: () => import(/* webpackChunkName: "about" */ '@app/views/About.vue'),
                toolbar: () => import(/* webpackChunkName: "about" */'@app/components/Toolbar.vue'),
            },
        },
        {
            path: '/login',
            name: 'login',
            components: {
                default: () => import(/* webpackChunkName: "login" */ '@app/views/Login.vue'),
                toolbar: () => import(/* webpackChunkName: "login" */'@app/components/Toolbar.vue'),
            },
        },
        {
            path: '*',
            name: 'not-found',
            components: {
                default: () => import('@app/views/NotFound.vue'),
                toolbar: () => import('@app/components/Toolbar.vue'),
            },
        },
    ],
});
