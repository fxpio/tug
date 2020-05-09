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
import {GitlabDriver} from '@server/composer/repositories/vcs-drivers/GitlabDriver';
import {LooseObject} from '@server/utils/LooseObject';

const supports: LooseObject = {
    'official domain http protocol': [true, 'https://gitlab.com/fxpio/fxp-security'],
    'official domain http protocol with www': [true, 'https://www.gitlab.com/fxpio/fxp-security'],
    'official domain http protocol with git extension': [true, 'https://gitlab.com/fxpio/fxp-security.git'],
    'official domain http protocol with www and git extension': [true, 'https://www.gitlab.com/fxpio/fxp-security.git'],

    'official domain git protocol': [true, 'git://gitlab.com/fxpio/fxp-security'],
    'official domain git protocol with www': [true, 'git://www.gitlab.com/fxpio/fxp-security'],
    'official domain git protocol with git extension': [true, 'git://gitlab.com/fxpio/fxp-security.git'],
    'official domain git protocol with www and git extension': [true, 'git://www.gitlab.com/fxpio/fxp-security.git'],

    'official domain git @': [true, 'git@gitlab.com:fxpio/fxp-security'],
    'official domain git @ with www': [true, 'git@www.gitlab.com:fxpio/fxp-security'],
    'official domain git @ with git extension': [true, 'git@gitlab.com:fxpio/fxp-security.git'],
    'official domain git @ with www and git extension': [true, 'git@www.gitlab.com:fxpio/fxp-security.git'],

    'invalid custom domain': [false, 'https://gitlab.fxp.io/fxpio/fxp-security'],
    'invalid custom domain with git extension': [false, 'https://gitlab.fxp.io/fxpio/fxp-security.git'],
};
const supportsKeys = Object.keys(supports);

for (const name of supportsKeys) {
    const values = supports[name];

    test('gitlab driver: ' + name, (t) => {
        const config = new Config();
        config.merge({
            'gitlab-oauth': {
                'gitlab.com': 'token',
            },
        });

        t.deepEqual(values[0], GitlabDriver.supports(config, values[1]));
    });
}
