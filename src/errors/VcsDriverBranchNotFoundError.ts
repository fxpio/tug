/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VcsDriverIdentifierNotFoundError} from '@app/errors/VcsDriverIdentifierNotFoundError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VcsDriverBranchNotFoundError extends VcsDriverIdentifierNotFoundError
{
    /**
     * Constructor.
     *
     * @param {string} branchName
     */
    constructor(branchName: string) {
        super('Branch', branchName);
    }
}
