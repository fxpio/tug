/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WithRender from '@app/components/App/template.html';
import Vue from 'vue';
import {MetaInfo} from 'vue-meta';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class App extends Vue
{
    public metaInfo(): MetaInfo {
        return {
            title: this.$i18n.t('page.home.name', {}) as string,
            titleTemplate: '%s · ' + this.$i18n.t('app.name')
        };
    }

    public get drawer(): boolean {
        return this.$store.state.drawer.show;
    }

    public set drawer(value) {
        this.$store.commit('drawer/toggle', value as boolean);
    }

    /**
     * Logout.
     */
    public async logout(): Promise<void> {
        await this.$store.dispatch('auth/logout');
    }
}
