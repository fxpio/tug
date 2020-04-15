/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface DataStorage {
    /**
     * Check if the storage has the key.
     *
     * @param {string} key The key
     *
     * @return {Promise<boolean>}
     */
    has(key: string): Promise<boolean>;

    /**
     * Get the data of key or null if the key doesn't exist.
     *
     * @param {string} key The key
     *
     * @return {Promise<string|null>}
     */
    get(key: string): Promise<string|null>;

    /**
     * Put the data for the key. If data is undefined, a directory is created.
     *
     * @param {string}        key    The key
     * @param {string|Buffer} [data] The data
     *
     * @return {Promise<string>}
     */
    put(key: string, data: string|Buffer): Promise<string>;

    /**
     * Delete the key.
     *
     * @param {string} key The key
     *
     * @return {Promise<string>}
     */
    delete(key: string): Promise<string>;
}
