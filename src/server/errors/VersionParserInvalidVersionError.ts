/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VersionParserError} from '@server/errors/VersionParserError';
import {pregQuote} from '@server/utils/regex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class VersionParserInvalidVersionError extends VersionParserError {
    public readonly version: string;
    public readonly fullVersion: string;
    public readonly isAlias: boolean;
    public readonly isAliasSource: boolean;

    /**
     * Constructor.
     *
     * @param {string} version     The version
     * @param {string} fullVersion The full version
     */
    constructor(version: string, fullVersion: string) {
        let extraMessage = '';
        let isAlias = false;
        let isAliasSource = false;

        if (fullVersion.match(new RegExp(' +as +' + pregQuote(version) + '$'))) {
            isAlias = true;
            extraMessage = ' in "' + fullVersion + '", the alias must be an exact version';
        } else if (fullVersion.match(new RegExp('^' + pregQuote(version) + ' +as +'))) {
            isAlias = true;
            isAliasSource = true;
            extraMessage = ' in "' + fullVersion + '", the alias source must be an exact version, if it is a branch name you should prefix it with dev-';
        }

        super(`Invalid version string "${version}"${extraMessage}`);

        this.version = version;
        this.fullVersion = fullVersion;
        this.isAlias = isAlias;
        this.isAliasSource = isAliasSource;
    }
}
