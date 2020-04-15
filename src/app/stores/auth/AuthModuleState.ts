/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthState} from '@app/stores/auth/AuthState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface AuthModuleState
{
    auth: AuthState;
}
