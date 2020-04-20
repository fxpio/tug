/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarMessage} from './SnackbarMessage';
import {Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class SnackbarManager extends Vue {
    public snack(message: SnackbarMessage): void {
        if (window) {
            window.dispatchEvent(new MessageEvent('snackbar-push-snack', {
                data: message,
            }));
        }
    }
}
