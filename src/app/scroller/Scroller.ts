/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Store} from 'vuex';
import OverlayScrollbars from 'overlayscrollbars';
import {DarkModeModuleState} from '@app/stores/darkMode/DarkModeModuleState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Scroller {
    /**
     * Set the store in global.
     */
    public static setStore(store: Store<DarkModeModuleState>): void {
        Scroller.store = store;
    }

    private static store: Store<DarkModeModuleState>;

    /**
     * Check if the dark mode is enabled.
     */
    private static isDark(darkMode?: boolean): boolean {
        if (undefined !== darkMode) {
            return darkMode;
        }

        return Scroller.store && Scroller.store.state.darkMode.enabled;
    }

    /**
     * Get the class name for the overlay scrollbar.
     */
    private static getClassName(darkMode?: boolean): string {
        return 'os-theme-' + (Scroller.isDark(darkMode) ? 'light' : 'dark');
    }

    private readonly os: OverlayScrollbars;

    /**
     * Constructor.
     */
    public constructor(el: HTMLElement, options: OverlayScrollbars.Options = {}) {
        this.os = OverlayScrollbars(el, Object.assign({}, options, {
            className: Scroller.getClassName(),
        }));

        if (Scroller.store) {
            Scroller.store.watch(
                (state) => state.darkMode.enabled,
                (enabled: boolean) => {
                    this.update(enabled);
                },
            );
        }
    }

    public getOverlayScrollbars(): OverlayScrollbars {
        return this.os;
    }

    public update(darkMode?: boolean): void {
        this.os.options({
            className: Scroller.getClassName(darkMode),
        });
    }

    public destroy(): void {
        this.os.destroy();
    }
}
