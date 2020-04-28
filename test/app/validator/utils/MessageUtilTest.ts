/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'ava';
import {MessageUtil} from '@app/validator/utils/MessageUtil';

test('test app validator message util replace values in message', (t) => {
    const res = MessageUtil.replace('Value "${value}" is invalid ("${ value }" given)', {value: 'foo bar'});

    t.deepEqual('Value "foo bar" is invalid ("foo bar" given)', res);
});
