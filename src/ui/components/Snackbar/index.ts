/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WithRender from '@app/ui/components/Snackbar/template.html';
import {RootState} from '@app/ui/stores/RootState';
import {SnackConfig} from '@app/ui/stores/snackbar/SnackConfig';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@WithRender
@Component
export class Snackbar extends Vue
{
    public show: boolean = false;

    public color: string|null = null;

    public message: string = '';

    public showCloseButton: boolean = true;

    public async created(): Promise<void> {
        this.$store.watch((state: RootState) => state.snackbar.config, (config: SnackConfig|null) => {
            if (config) {
                this.show = true;
                this.message = config.message;
                this.color = config.color ? config.color : null;
                this.showCloseButton = true === config.closeButton || undefined === config.closeButton;
                this.$store.commit('snackbar/snack');
            }
        });
    }
}

Vue.component('snackbar', Snackbar);
