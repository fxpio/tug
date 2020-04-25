/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'ava';
import {getRedirectAppPath} from '@server/utils/ui';

const redirectAppPaths: any = [
    ['/admin', '/admin/app', '/'],
    ['/admin', '/admin/app', '/admin'],
    ['/admin', '/prod/admin/app', '/prod'],
    ['/admin', '/prod/admin/app', '/prod/admin'],
    ['/admin', '/sub/path/admin/app', '/sub/path'],
    ['/admin', '/sub/path/admin/app', '/sub/path/admin'],
    ['/prod/admin', '/prod/admin/app', '/prod'],
    ['/prod/admin', '/prod/admin/app', '/prod/admin'],
];

for (const config of redirectAppPaths) {
    const basePath = config[0];
    const expected = config[1];
    const reqPath = config[2];

    test(`test ui get redirect app path with base '${basePath}': '${reqPath}' -> '${expected}'`, (t) => {
        t.deepEqual(getRedirectAppPath(basePath, reqPath), expected);
    });
}
