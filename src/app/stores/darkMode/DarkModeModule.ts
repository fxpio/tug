/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DarkModeModuleState} from './DarkModeModuleState';
import {DarkModeState} from './DarkModeState';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DarkModeModule<R extends DarkModeModuleState> implements Module<DarkModeState, R> {
    private readonly storage: Storage;

    public constructor(storage?: Storage) {
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): DarkModeState {
        const darkMode: string | null = this.storage.getItem('darkMode:enabled');

        return {
            enabled: null === darkMode ? false : 'true' === darkMode,
        };
    }

    public get mutations(): MutationTree<DarkModeState> {
        const self = this;

        return {
            toggle(state: DarkModeState, enabled?: boolean): void {
                state.enabled = undefined === enabled ? !state.enabled : enabled;
                self.storage.setItem('darkMode:enabled', state.enabled ? 'true' : 'false');
            },
        };
    }
}
