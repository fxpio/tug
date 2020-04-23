/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {ComponentOptions} from 'vue';

/**
 * Long press vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export const createLongClickMixin = (options?: LongClickOptions): ComponentOptions<Vue> => {
    options = options || {};
    options.duration = options.duration || 400;

    return {
        mounted(): void {
            const self = this as LongClickVue;
            const longClickAction: (e: Event) => void = self.$listeners['long-click'] as (e: Event) => void | undefined;
            let clickAction: (e: Event) => void;

            if (!longClickAction || undefined !== self.$longClickDestroy) {
                return;
            }

            if (self.$listeners.click) {
                clickAction = self.$listeners.click as () => void;
                self.$off('click', clickAction);
            }

            const onPressHandler = () => {
                self.$longClickTimeout = setTimeout(() => {
                    self.$longClickEnabled = true;
                }, (options as LongClickOptions).duration);
            };

            const onUnPressHandler = (e: Event) => {
                if (self.$longClickEnabled) {
                    e.preventDefault();
                    longClickAction(e);
                } else if (clickAction) {
                    clickAction(e);
                }

                clearTimeout(self.$longClickTimeout);
                delete self.$longClickTimeout;
                delete self.$longClickEnabled;
            };

            self.$longClickDestroy = () => {
                self.$el.removeEventListener('mousedown', onPressHandler);
                self.$el.removeEventListener('touchstart', onPressHandler);
                self.$el.removeEventListener('mouseup', onUnPressHandler);
                self.$el.removeEventListener('touchend', onUnPressHandler);
                self.$el.removeEventListener('touchcancel', onUnPressHandler);
                self.$el.removeEventListener('touchleave', onUnPressHandler);
            };

            self.$el.addEventListener('mousedown', onPressHandler);
            self.$el.addEventListener('touchstart', onPressHandler);
            self.$el.addEventListener('mouseup', onUnPressHandler);
            self.$el.addEventListener('touchend', onUnPressHandler);
            self.$el.addEventListener('touchcancel', onUnPressHandler);
            self.$el.addEventListener('touchleave', onUnPressHandler);
        },
        beforeDestroy(): void {
            const self = this as LongClickVue;

            if (undefined === self.$longClickDestroy) {
                return;
            }

            self.$longClickDestroy();
            delete self.$longClickDestroy;
            delete self.$longClickTimeout;
            delete self.$longClickEnabled;
        },
    };
};

export interface LongClickOptions {
    duration?: number;
}

export interface LongClickVue extends Vue {
    $longClickDestroy?: () => void;
    $longClickTimeout?: number;
    $longClickEnabled?: boolean;
}
