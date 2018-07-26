/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import WithRender from './template.html';
import {MetaInfo} from 'vue-meta';
import {TOGGLE_DRAWER} from '../../store';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export default class App extends Vue
{
    public metaInfo(): MetaInfo {
        return {
            title: Vue.i18n.translate('page.home.name', {}),
            titleTemplate: '%s · ' + Vue.i18n.translate('app.name', {})
        };
    }

    public get drawer(): boolean {
        return this.$store.state.showDrawer;
    }

    public set drawer(value) {
        this.$store.commit(TOGGLE_DRAWER, value as boolean);
    }

    /**
     * Logout.
     */
    public async logout(): Promise<void> {
        await this.$store.dispatch('logout');
    }
}
