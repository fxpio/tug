/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarModuleState} from '@app/ui/stores/snackbar/SnackbarModuleState';
import {SnackbarState} from '@app/ui/stores/snackbar/SnackbarState';
import {SnackConfig} from '@app/ui/stores/snackbar/SnackConfig';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class SnackbarModule<R extends SnackbarModuleState> implements Module<SnackbarState, R>
{
    public get namespaced(): boolean {
        return true;
    }

    public get state(): SnackbarState {
        return {
            config: null
        };
    }

    public get mutations(): MutationTree<SnackbarState> {
        return {
            snack(state: SnackbarState, config?: SnackConfig): void {
                state.config = config ? config : null;
            },
        };
    }
}
