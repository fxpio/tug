/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface VForm extends Vue {
    lazyValidation: boolean;

    value: boolean;

    /**
     * Resets the state of all registered inputs (inside the form) to {} for arrays
     * and null for all other values. Resets errors bag when using the lazy-validation prop.
     */
    reset(): void;

    /**
     * Resets validation of all registered inputs without modifying their state.
     */
    resetValidation(): void;

    /**
     * Validates all registered inputs. Returns true if successful and false if not.
     */
    validate(): boolean;
}
