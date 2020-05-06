/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from './LooseObject';

/**
 * Check if the item is an object.
 *
 * @return {boolean}
 */
export function isObject(item: any|null): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge objects.
 *
 * @param {LooseObject}   target  The object target
 * @param {LooseObject[]} sources The object sources
 *
 * @return {LooseObject}
 */
export function mergeDeep<T = any>(target: LooseObject<T>, ...sources: Array<LooseObject<T>|null>): LooseObject<T> {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }

            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {
                        [key]: {},
                    });
                }

                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
