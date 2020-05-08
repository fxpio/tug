/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from '@server/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Results {
    private readonly results: LooseObject[];

    private readonly count: number;

    private readonly total: number;

    private readonly lastId: string|undefined;

    /**
     * Constructor.
     *
     * @param {LooseObject[]} results  The results
     * @param {number}        count    The count of result
     * @param {number}        [total]  The total of query
     * @param {string}        [lastId] The last id for the pagination
     */
    constructor(results: LooseObject[], count: number, total?: number, lastId?: string) {
        this.results = results;
        this.count = count;
        this.total = undefined !== total ? total : count;
        this.lastId = lastId;
    }

    /**
     * Get the rows.
     *
     * @return {LooseObject[]}
     */
    public getRows(): LooseObject[] {
        return this.results;
    }

    /**
     * Get the count.
     *
     * @return {number}
     */
    public getCount(): number {
        return this.count;
    }

    /**
     * Get the total.
     *
     * @return {number}
     */
    public getTotal(): number {
        return this.total;
    }

    /**
     * Check if the last id is defined.
     *
     * @return {boolean}
     */
    public hasLastId(): boolean {
        return null !== this.lastId;
    }

    /**
     * Get the last id for the pagination.
     *
     * @return {string|undefined}
     */
    public getLastId(): string|undefined {
        return this.lastId;
    }
}
