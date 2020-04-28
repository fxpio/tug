/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MessageResponse} from '../MessageResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface GithubOauthTokenDeleteResponse extends MessageResponse {
    host: string;
}
