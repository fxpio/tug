/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Store} from 'vuex';
import {ThemerClasses} from './ThemerClasses';
import {DarkModeModuleState} from '@app/stores/darkMode/DarkModeModuleState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Themer {
    /**
     * Convert string classes into themer classes map.
     *
     * @param {ThemerClasses|string} classes
     *
     * @return {ThemerClasses}
     */
    public static toClasses(classes: ThemerClasses|string): ThemerClasses {
        if (typeof classes === 'string') {
            const strings = classes.split(' ');
            classes = {} as ThemerClasses;

            strings.forEach((value) => {
                (classes as ThemerClasses)[value.trim()] = true;
            });
        }

        return classes;
    }

    private store: Store<DarkModeModuleState>;

    /**
     * Constructor.
     *
     * @param {Store<DarkModeModuleState>} store
     */
    public constructor(store: Store<DarkModeModuleState>) {
        this.store = store;
    }

    /**
     * Create a computed object for the classes and select automatically the good theme.
     *
     * @param {ThemerClasses|string} classes
     * @param {ThemerClasses|string} [darkClasses]
     */
    public classes(classes: ThemerClasses|string, darkClasses?: ThemerClasses|string): ThemerClasses {
        classes = Themer.toClasses(classes);
        darkClasses = darkClasses ? Themer.toClasses(darkClasses) : {};

        Object.keys(darkClasses).forEach((key) => {
            const prevValue = undefined !== (classes as ThemerClasses)[key]
                ? (classes as ThemerClasses)[key]
                : true;

            if ((darkClasses as ThemerClasses)[key] as boolean) {
                (classes as ThemerClasses)[key] = prevValue && this.store.state.darkMode.enabled;
            } else {
                (classes as ThemerClasses)[key] = prevValue && !this.store.state.darkMode.enabled;
            }
        });

        return classes;
    }

    /**
     * Select automatically the good theme.
     *
     * @param {string} color
     * @param {string} [darkColor]
     *
     * @return {string}
     */
    public color(color: string, darkColor?: string): string {
        if (undefined !== darkColor && this.store.state.darkMode.enabled) {
            return darkColor;
        }

        return color;
    }
}
