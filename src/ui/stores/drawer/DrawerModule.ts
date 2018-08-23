/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerModuleState} from '@app/ui/stores/drawer/DrawerModuleState';
import {DrawerState} from '@app/ui/stores/drawer/DrawerState';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DrawerModule<R extends DrawerModuleState> implements Module<DrawerState, R>
{
    public get namespaced(): boolean {
        return true;
    }

    public get state(): DrawerState {
        return {
            show: null === localStorage.getItem('drawer:show') ? true : 'true' === (localStorage.getItem('drawer:show'))
        };
    }

    public get mutations(): MutationTree<DrawerState> {
        return {
            toggle(state: DrawerState, show?: boolean): void {
                state.show = undefined === show ? !state.show : show;
                localStorage.setItem('drawer:show', state.show ? 'true' : 'false');
            },
        };
    }
}
