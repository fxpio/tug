/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class FormContent extends Vue {
    public formAlert: string|null = null;

    /**
     * Must be used in the `v-model` directive of the `v-form` component.
     */
    public formValid: boolean = true;

    public get showFormAlert(): boolean {
        return null !== this.formAlert;
    }

    /**
     * Reset the field values of the form.
     *
     * Vee validate detects a null value as an entered value
     * and the properties must be initialized with a value.
     *
     * To remove the error messages, the values must be undefined
     *
     * @param {string[]} properties The list of properties
     */
    protected resetFormFields(properties: string[]): void {
        properties.forEach((property: string) => {
            (this as any)[property] = undefined;
        });
    }
}
