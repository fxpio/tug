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

    /**
     * Update the html meta theme color with the background color of the selected element.
     */
    public static updateThemeColor(classNames: string): void {
        const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        const app = document.getElementsByClassName(classNames);

        if (themeColor && app.length > 0) {
            window.setTimeout(() => {
                let bgColor = window.getComputedStyle(app[0], null)
                    .getPropertyValue('background-color');

                bgColor = Themer.rgbToHex(bgColor);

                if (bgColor) {
                    themeColor.content = bgColor;
                }
            }, 1);
        }
    }

    /**
     * Convert the string RGB value into the hexadecimal.
     */
    public static rgbToHex(rgb: string): string {
        const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
        const rgbs = rgb.substr(4).split(')')[0].split(sep);

        let r = (+rgbs[0]).toString(16);
        let g = (+rgbs[1]).toString(16);
        let b = (+rgbs[2]).toString(16);

        if (1 === r.length) {
            r = '0' + r;
        }

        if (1 === g.length) {
            g = '0' + g;
        }

        if (1 === b.length) {
            b = '0' + b;
        }

        return '#' + r + g + b;
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
