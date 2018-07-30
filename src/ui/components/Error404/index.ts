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
import WithRender from '@app/ui/components/Error404/template.html';
import {MetaInfo} from 'vue-meta';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Error404 extends Vue
{
    public metaInfo(): MetaInfo {
        return {
            title: Vue.i18n.translate('error.404_page_not_found', {})
        };
    }
}
