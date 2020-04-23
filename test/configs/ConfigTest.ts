/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'ava';
import {Config} from '@server/configs/Config';


test('test config to get default values', (t) => {
    const config = new Config();

    t.deepEqual(config.get('github-domains'), ['github.com']);
    t.deepEqual(config.get('github-oauth'), {});
});

test('test config to get default all values', (t) => {
    const config = new Config();

    t.deepEqual(config.all(), Config.defaultConfig);
});

test('test config to get nonexistent value', (t) => {
    const config = new Config();

    t.deepEqual(config.get('invalid-key'), null);
});

test('test config to check if key exists', (t) => {
    const config = new Config();

    t.true(config.has('github-domains'));
    t.true(config.has('github-oauth'));
    t.false(config.has('invalid-key'));
    t.false(config.has('github-oauth[invalid-key]'));
});

test('test config to merge with new config', (t) => {
    const config = new Config();

    t.deepEqual(config.get('github-oauth[github.com]'), null);
    t.deepEqual(config.get('github-oauth["github.com"]'), null);

    config.merge({
        'github-oauth': {
            'github.com': 'MY_TOKEN',
        },
    });

    t.deepEqual(config.get('github-oauth[github.com]'), 'MY_TOKEN');
    t.deepEqual(config.get('github-oauth["github.com"]'), 'MY_TOKEN');
});
