/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WithRender from '@app/ui/pages/Login/template.html';
import {getRequestErrorMessage} from '@app/ui/utils/error';
import Vue from 'vue';
import {MetaInfo} from 'vue-meta';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Login extends Vue
{
    public metaInfo(): MetaInfo {
        return {
            title: Vue.i18n.translate('security.login', {})
        };
    }

    public formAlert: string|null = null;

    public username: string|null = null;

    public password: string|null = null;

    public async login(): Promise<void> {
        if (!await this.$validator.validateAll()) {
            return;
        }

        await this.$store.dispatch('auth/login', {
            username: this.username,
            password: this.password
        }).catch(e => {
            this.formAlert = getRequestErrorMessage(e);
        });
    }
}
