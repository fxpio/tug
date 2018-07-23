/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'ava';
import Config from '../../../../src/configs/Config';
import GithubDriver from '../../../../src/composer/repositories/vcs-drivers/GithubDriver';
import {LooseObject} from '../../../../src/utils/LooseObject';

const supports: LooseObject = {
    'official domain http protocol': [true, 'https://github.com/fxpio/fxp-security'],
    'official domain http protocol with www': [true, 'https://www.github.com/fxpio/fxp-security'],
    'official domain http protocol with git extension': [true, 'https://github.com/fxpio/fxp-security.git'],
    'official domain http protocol with www and git extension': [true, 'https://www.github.com/fxpio/fxp-security.git'],

    'official domain git protocol': [true, 'git://github.com/fxpio/fxp-security'],
    'official domain git protocol with www': [true, 'git://www.github.com/fxpio/fxp-security'],
    'official domain git protocol with git extension': [true, 'git://github.com/fxpio/fxp-security.git'],
    'official domain git protocol with www and git extension': [true, 'git://www.github.com/fxpio/fxp-security.git'],

    'official domain git @': [true, 'git@github.com:fxpio/fxp-security'],
    'official domain git @ with www': [true, 'git@www.github.com:fxpio/fxp-security'],
    'official domain git @ with git extension': [true, 'git@github.com:fxpio/fxp-security.git'],
    'official domain git @ with www and git extension': [true, 'git@www.github.com:fxpio/fxp-security.git'],

    'invalid custom domain': [false, 'https://github.fxp.io/fxpio/fxp-security'],
    'invalid custom domain with git extension': [false, 'https://github.fxp.io/fxpio/fxp-security.git'],
};
const supportsKeys = Object.keys(supports);

for (let i = 0; i < supportsKeys.length; ++i) {
    let name = supportsKeys[i];
    let values = supports[name];

    test('github driver: ' + name, t => {
        let config = new Config();

        t.deepEqual(values[0], GithubDriver.supports(config, values[1]));
    });
}
