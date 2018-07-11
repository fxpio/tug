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
export default class VcsDriverNotFoundError extends Error
{
    /**
     * Constructor.
     *
     * @param {String} message
     * @param {String} [fileName}
     * @param {Number} [lineNumber}
     */
    constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
    }
}
