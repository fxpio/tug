/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VcsDriver from './VcsDriver';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GithubDriver extends VcsDriver
{
    /**
     * @inheritDoc
     */
    static supports(config, url) {
        let matches = url.match(/^((?:https?|git):\/\/([^\/]+)\/|git@([^:]+):)([^\/]+)\/(.+?)(?:\.git|\/)?$/);

        if (!matches) {
            return false;
        }

        let originUrl = undefined !== matches[2] ? matches[2] : matches[3];

        return config.get('github-domains').includes(originUrl.replace(/^www\./i, ''));
    }
}
