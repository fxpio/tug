/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {I18nState} from '@app/ui/states/I18nState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RootState
{
    i18n: I18nState;
    isAuthenticated: boolean;
    authenticationPending: boolean;
    authToken: string|null;
    showDrawer: boolean;
}
