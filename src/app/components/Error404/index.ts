/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WithRender from '@app/components/Error404/template.html';
import Vue from 'vue';
import {MetaInfo} from 'vue-meta';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Error404 extends Vue
{
    public metaInfo(): MetaInfo {
        return {
            title: this.$i18n.t('error.404_page_not_found') as string
        };
    }
}
