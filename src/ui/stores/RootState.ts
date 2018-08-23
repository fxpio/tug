/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthModuleState} from '@app/ui/stores/auth/AuthModuleState';
import {DrawerModuleState} from '@app/ui/stores/drawer/DrawerModuleState';
import {I18nModuleState} from '@app/ui/stores/i18n/I18nModuleState';
import {SnackbarModuleState} from '@app/ui/stores/snackbar/SnackbarModuleState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RootState extends I18nModuleState, AuthModuleState, DrawerModuleState, SnackbarModuleState
{
}
