/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import HttpNotFoundError from './HttpNotFoundError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BranchNotFoundError extends HttpNotFoundError
{
    /**
     * Constructor.
     *
     * @param {String} branchName
     * @param {String} [fileName}
     * @param {Number} [lineNumber}
     */
    constructor(branchName, fileName, lineNumber) {
        super(`Branch "${branchName}" is not found`, fileName, lineNumber);
    }
}
