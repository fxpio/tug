/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsRepositoryError} from '@server/errors/VcsRepositoryError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VcsRepositoryAttributeRequiredError extends VcsRepositoryError {
    public readonly attribute: string;

    /**
     * Constructor.
     *
     * @param {string} attribute The attribute name
     */
    constructor(attribute: string) {
        super(`The "${attribute}" attribute of vcs repository is required`);
        this.attribute = attribute;
    }
}
