/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'node-polyglot';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
declare module 'node-polyglot' {
    interface PolyglotOptions
    {
        interpolation?: InterpolationOptions
    }

    interface InterpolationOptions
    {
        prefix: string;
        suffix: string;
    }
}
