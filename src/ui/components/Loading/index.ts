/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WithRender from '@app/ui/components/Loading/template.html';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Loading extends Vue
{
    @Prop({type: Boolean, default: false})
    public value: boolean;

    @Prop({type: String, default: null})
    public message: string|null;

    @Prop({type: String, default: 'accent'})
    public progressColor: string;
}

Vue.component('loading', Loading);
