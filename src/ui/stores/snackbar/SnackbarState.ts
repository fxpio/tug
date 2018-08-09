/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackConfig} from '@app/ui/stores/snackbar/SnackConfig';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface SnackbarState
{
    config: SnackConfig|null;
}
