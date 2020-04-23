/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'ava';
import {VersionParser} from '@server/composer/semver/VersionParser';
import {VersionParserInvalidVersionError} from '@server/errors/VersionParserInvalidVersionError';
import {LooseObject} from '@server/utils/LooseObject';

const successfulNormalizedVersions: LooseObject = {
    'none': ['1.0.0', '1.0.0.0'],
    'none/2': ['1.2.3.4', '1.2.3.4'],
    'parses state': ['1.0.0RC1dev', '1.0.0.0-RC1-dev'],
    'CI parsing': ['1.0.0-rC15-dev', '1.0.0.0-RC15-dev'],
    'delimiters': ['1.0.0.RC.15-dev', '1.0.0.0-RC15-dev'],
    'RC uppercase': ['1.0.0-rc1', '1.0.0.0-RC1'],
    'patch replace': ['1.0.0.pl3-dev', '1.0.0.0-patch3-dev'],
    'forces w.x.y.z': ['1.0-dev', '1.0.0.0-dev'],
    'forces w.x.y.z/2': ['0', '0.0.0.0'],
    'parses long': ['10.4.13-beta', '10.4.13.0-beta'],
    'parses long/2': ['10.4.13beta2', '10.4.13.0-beta2'],
    'parses long/semver': ['10.4.13beta.2', '10.4.13.0-beta2'],
    'expand shorthand': ['10.4.13-b', '10.4.13.0-beta'],
    'expand shorthand/2': ['10.4.13-b5', '10.4.13.0-beta5'],
    'strips leading v': ['v1.0.0', '1.0.0.0'],
    'parses dates y-m as classical': ['2010.01', '2010.01.0.0'],
    'parses dates w/ . as classical': ['2010.01.02', '2010.01.02.0'],
    'parses dates y.m.Y as classical': ['2010.1.555', '2010.1.555.0'],
    'parses dates y.m.Y/2 as classical': ['2010.10.200', '2010.10.200.0'],
    'strips v/datetime': ['v20100102', '20100102'],
    'parses dates w/ -': ['2010-01-02', '2010.01.02'],
    'parses numbers': ['2010-01-02.5', '2010.01.02.5'],
    'parses dates y.m.Y': ['2010.1.555', '2010.1.555.0'],
    'parses datetime': ['20100102-203040', '20100102.203040'],
    'parses dt+number': ['20100102203040-10', '20100102203040.10'],
    'parses dt+patch': ['20100102-203040-p1', '20100102.203040-patch1'],
    'parses master': ['dev-master', '9999999-dev'],
    'parses trunk': ['dev-trunk', '9999999-dev'],
    'parses branches': ['1.x-dev', '1.9999999.9999999.9999999-dev'],
    'parses arbitrary': ['dev-feature-foo', 'dev-feature-foo'],
    'parses arbitrary/2': ['DEV-FOOBAR', 'dev-FOOBAR'],
    'parses arbitrary/3': ['dev-feature/foo', 'dev-feature/foo'],
    'parses arbitrary/4': ['dev-feature+issue-1', 'dev-feature+issue-1'],
    'ignores aliases': ['dev-master as 1.0.0', '9999999-dev'],
    'semver metadata/2': ['1.0.0-beta.5+foo', '1.0.0.0-beta5'],
    'semver metadata/3': ['1.0.0+foo', '1.0.0.0'],
    'semver metadata/4': ['1.0.0-alpha.3.1+foo', '1.0.0.0-alpha3.1'],
    'semver metadata/5': ['1.0.0-alpha2.1+foo', '1.0.0.0-alpha2.1'],
    'semver metadata/6': ['1.0.0-alpha-2.1-3+foo', '1.0.0.0-alpha2.1-3'],
    'metadata w/ alias': ['1.0.0+foo as 2.0', '1.0.0.0'],
};
const successfulNormalizedVersionsKeys = Object.keys(successfulNormalizedVersions);

for (const name of successfulNormalizedVersionsKeys) {
    const values = successfulNormalizedVersions[name];

    test('test normalize succeeds: ' + name, (t) => {
        const parser = new VersionParser();
        t.is(parser.normalize(values[0]), values[1]);
    });
}


const failingNormalizedVersions: LooseObject = {
    'empty ': [''],
    'invalid chars': ['a'],
    'invalid type': ['1.0.0-meh'],
    'too many bits': ['1.0.0.0.0'],
    'non-dev arbitrary': ['feature-foo'],
    'metadata w/ space': ['1.0.0+foo bar'],
    'maven style release': ['1.0.1-SNAPSHOT'],
    'invalid version in alias': ['1.x as 1.x'],
    'invalid version in alias for branch': ['1.0.0-meh as 1.0'],
};
const failingNormalizedVersionsKeys = Object.keys(failingNormalizedVersions);

for (const name of failingNormalizedVersionsKeys) {
    const values = failingNormalizedVersions[name];

    test('test normalize fails: ' + name, (t) => {
        const error = t.throws(() => {
            const parser = new VersionParser();
            parser.normalize(values[0]);
        }, {
            instanceOf: VersionParserInvalidVersionError,
        });

        t.true(error.message.startsWith('Invalid version string '));
    });
}


const successfulNormalizedBranches: LooseObject = {
    'parses x': ['v1.x', '1.9999999.9999999.9999999-dev'],
    'parses *': ['v1.*', '1.9999999.9999999.9999999-dev'],
    'parses digits': ['v1.0', '1.0.9999999.9999999-dev'],
    'parses digits/2': ['2.0', '2.0.9999999.9999999-dev'],
    'parses long x': ['v1.0.x', '1.0.9999999.9999999-dev'],
    'parses long *': ['v1.0.3.*', '1.0.3.9999999-dev'],
    'parses long digits': ['v2.4.0', '2.4.0.9999999-dev'],
    'parses long digits/2': ['2.4.4', '2.4.4.9999999-dev'],
    'parses master': ['master', '9999999-dev'],
    'parses trunk': ['trunk', '9999999-dev'],
    'parses arbitrary': ['feature-a', 'dev-feature-a'],
    'parses arbitrary/2': ['FOOBAR', 'dev-FOOBAR'],
    'parses arbitrary/3': ['feature+issue-1', 'dev-feature+issue-1'],
};
const successfulNormalizedBranchesKeys = Object.keys(successfulNormalizedBranches);

for (const name of successfulNormalizedBranchesKeys) {
    const values = successfulNormalizedBranches[name];

    test('test normalize branch: ' + name, (t) => {
        const parser = new VersionParser();
        t.is(parser.normalizeBranch(values[0]), values[1]);
    });
}
