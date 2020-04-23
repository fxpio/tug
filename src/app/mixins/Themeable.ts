/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component, Inject, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class Themeable extends Vue {
    @Prop({type: Boolean, default: null})
    public light!: boolean | null;

    @Prop({type: Boolean, default: null})
    public dark!: boolean | null;

    public themeableProvide: ThemeableProvide = {
        isDark: false,
    };

    @Inject({default: false})
    public theme!: ThemeableProvide;

    public get isDark(): boolean {
        // Explicitly values
        if (this.dark === true) {
            return true;
        } else if (this.light === true) {
            return false;
        }

        // Inherit from parent, or default false if there is none
        return this.theme.isDark;
    }

    public get themeClasses(): Record<string, boolean> {
        return {
            'theme--dark': this.isDark,
            'theme--light': !this.isDark,
        };
    }

    /**
     * Used by menus and dialogs, inherits from v-app instead of the parent
     */
    public get rootIsDark(): boolean {
        // Explicitly values
        if (this.dark === true) {
            return true;
        } else if (this.light === true) {
            return false;
        }

        // Inherit from v-app
        return this.$vuetify.theme.dark;
    }

    public get rootThemeClasses(): Record<string, boolean> {
        return {
            'theme--dark': this.rootIsDark,
            'theme--light': !this.rootIsDark,
        };
    }

    @Watch('iDark', {immediate: true})
    public onIsDarkChanged(newVal: any, oldVal: any): void {
        if (newVal !== oldVal) {
            this.themeableProvide.isDark = this.isDark;
        }
    }
}

export interface ThemeableProvide {
    isDark: boolean;
}
