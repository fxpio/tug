/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Themer} from '@app/themer/Themer';
import {ThemerClasses} from '@app/themer/ThemerClasses';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $themer: Themer;
        $classes: (classes: Array<ThemerClasses|string>|ThemerClasses|string, darkClasses?: ThemerClasses|string) => ThemerClasses;
        $color: (color: Array<string|undefined>|string, darkColor?: string) => string;
    }
}
