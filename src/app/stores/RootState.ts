/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthModuleState} from './auth/AuthModuleState';
import {DarkModeModuleState} from './darkMode/DarkModeModuleState';
import {DrawerModuleState} from './drawer/DrawerModuleState';
import {I18nModuleState} from './i18n/I18nModuleState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RootState extends AuthModuleState,
    DarkModeModuleState,
    DrawerModuleState,
    I18nModuleState {
}
