/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {FormContent} from './FormContent';
import {AjaxContent} from './AjaxContent';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxFormContent extends mixins(FormContent, AjaxContent) {
    public get formAlert(): string|null {
        return this.previousError && this.previousError.message ? this.previousError.message : null;
    }

    public get showFormAlert(): boolean {
        return null !== this.formAlert;
    }
}
