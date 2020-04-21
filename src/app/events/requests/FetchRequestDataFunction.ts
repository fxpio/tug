/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FetchRequestDataEvent} from './FetchRequestDataEvent';
import {ListResponse} from '@app/api/models/responses/ListResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export type FetchRequestDataFunction = (event: FetchRequestDataEvent<ListResponse<object>>) => Promise<ListResponse<object>>;
