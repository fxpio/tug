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
export interface CodeRepository
{
    id: string;
    url: string;
    type: string;
    packageName?: string;
    rootIdentifier?: string;
    lastHash: string;
}
