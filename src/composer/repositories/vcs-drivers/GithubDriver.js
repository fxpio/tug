/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Config from '../../../configs/Config';
import VcsDriverError from '../../../errors/VcsDriverError';
import RemoteFilesystem from '../../utils/RemoteFilesystem';
import VcsDriver from './VcsDriver';
import TransportError from "../../../errors/TransportError";

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class GithubDriver extends VcsDriver
{
    /**
     * Constructor.
     *
     * @param {Object}           repoConfig         The repository config
     * @param {Config}           config             The config
     * @param {RemoteFilesystem} [remoteFilesystem] The remote filesystem
     */
    constructor(repoConfig, config, remoteFilesystem = null) {
        super(repoConfig, config, remoteFilesystem);

        let match = this.url.match(/^(?:(?:https?|git):\/\/([^\/]+)\/|git@([^:]+):)([^\/]+)\/(.+?)(?:\.git|\/)?$/);

        this.owner = match[3];
        this.repository = match[4];
        this.originUrl = undefined !== match[1] ? match[1] : match[2];

        if ('www.github.com' === this.originUrl) {
            this.originUrl = 'github.com';
        }

        this.url = `https://${this.originUrl}/${this.owner}/${this.repository}.git`;
        this.repoConfig['url'] = this.url;
        this.repoData = null;
        this.rootIdentifier = null;
        this.isPrivate = false;
        this.hasIssues = false;
        this.infoCache = {};
        this.tags = null;
        this.branches = null;
    }

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

    /**
     * @inheritDoc
     */
    getUrl() {
        return this.url;
    }

    /**
     * Get the api url.
     *
     * @return {String}
     */
    getApiUrl() {
        let apiUrl = 'github.com' === this.originUrl ? 'api.github.com' : `${this.originUrl}/api/v3`;

        return `https://${apiUrl}`;
    }

    /**
     * Generate an ssh url.
     *
     * @return {String}
     */
    generateSshUrl() {
        return `git@${this.originUrl}:${this.owner}/${this.repository}.git`;
    }

    /**
     * @inheritDoc
     */
    async getRepoData() {
        await this.fetchRootIdentifier();

        return this.repoData;
    }

    /**
     * @inheritDoc
     */
    async getRootIdentifier() {
        await this.fetchRootIdentifier();

        return this.rootIdentifier;
    }

    /**
     * @inheritDoc
     */
    getSource(identifier) {
        let url = this.isPrivate ? this.generateSshUrl() : this.getUrl();

        return {
            type: 'git',
            url : url,
            reference: identifier
        };
    }

    /**
     * @inheritDoc
     */
    getDist(identifier) {
        let url = `${this.getApiUrl()}/repos/${this.owner}/${this.repository}/zipball/${identifier}`;

        return {
            type: 'zip',
            url: url,
            reference: identifier,
            shasum: ''
        };
    }

    /**
     * @inheritDoc
     */
    async getComposerInformation(identifier) {
        if (!this.infoCache[identifier]) {
            let composer = await this.getBaseComposerInformation(identifier);

            if (composer) {
                // specials for github
                if (composer['support'] && composer['support']['source']) {
                    composer['support']['source'] = `https://${this.originUrl}/${this.owner}/${this.repository}/tree/${identifier}`;
                }

                if (this.hasIssues && composer['support'] && composer['support']['issues']) {
                    composer['support']['issues'] = `https://${this.originUrl}/${this.owner}/${this.repository}/issues`;
                }
            }

            this.infoCache[identifier] = composer;
        }

        return this.infoCache[identifier];
    }

    /**
     * @inheritDoc
     */
    async getFileContent(file, identifier) {
        let content = null;
        let error = null;

        try {
            let resource = `${this.getApiUrl()}/repos/${this.owner}/${this.repository}/contents/${file}?ref=${encodeURIComponent(identifier)}`;
            resource = JSON.parse(await this.getContents(resource));

            if (resource['content'] && 'base64' === resource['encoding']) {
                content = Buffer.from(resource['content'], 'base64').toString();
            } else {
                error = new VcsDriverError(`Could not retrieve "${file}" for "${identifier}"`);
            }
        } catch (e) {
            if (e instanceof TransportError) {
                if (404 !== e.getStatusCode()) {
                    error = e;
                }
            }
        }

        if (error) {
            throw error;
        }

        return content;
    }

    /**
     * @inheritDoc
     */
    async getChangeDate(identifier) {
        let resource = `${this.getApiUrl()}/repos/${this.owner}/${this.repository}/commits/${encodeURIComponent(identifier)}`;
        let commit = JSON.parse(await this.getContents(resource));

        return new Date(commit['commit']['committer']['date']);
    }

    /**
     * @inheritDoc
     */
    async getTags() {
        if (null === this.tags) {
            this.tags = {};
            let resource = `${this.getApiUrl()}/repos/${this.owner}/${this.repository}/tags?per_page=100`;

            do {
                let tagsData = JSON.parse(await this.getContents(resource));
                if (tagsData) {
                    for (let tag of tagsData) {
                        this.tags[tag['name']] = tag['commit']['sha'];
                    }
                }

                resource = this.getNextPage();
            } while (resource);
        }

        return this.tags;
    }

    /**
     * @inheritDoc
     */
    async getBranches() {
        if (null === this.branches) {
            this.branches = {};
            let resource = `${this.getApiUrl()}/repos/${this.owner}/${this.repository}/git/refs/heads?per_page=100`;
            let branchBlacklist = ['gh-pages'];

            do {
                let branchData = JSON.parse(await this.getContents(resource));
                if (branchData) {
                    for (let branch of branchData) {
                        let name = branch['ref'].substr(11);

                        if (!branchBlacklist.includes(name)) {
                            this.branches[name] = branch['object']['sha'];
                        }
                    }
                }

                resource = this.getNextPage();
            } while (resource);
        }

        return this.branches;
    }

    /**
     * @inheritDoc
     */
    async getContents(url, fetchingRepoData = false) {
        try {
            return await this.rfs.get(this.originUrl, url, {});
        } catch (e) {
            return false;
        }
    }

    /**
     * Fetch the root identifier.
     */
    async fetchRootIdentifier() {
        if (this.repoData) {
            return;
        }

        let repoDataUrl = `${this.getApiUrl()}/repos/${this.owner}/${this.repository}`;
        let contentData = await this.getContents(repoDataUrl, true);
        try {
            this.repoData = JSON.parse(contentData);
        } catch (e) {
            throw new VcsDriverError(`"${repoDataUrl}" does not contain valid JSON` + "\n" + e.message);
        }

        if (this.repoData) {
            this.owner = this.repoData['owner']['login'];
            this.repository = this.repoData['name'];
            this.isPrivate = undefined !== this.repoData['private'] && this.repoData['private'];
            this.hasIssues = undefined !== this.repoData['has_issues'] && this.repoData['has_issues'];

            if (this.repoData.hasOwnProperty('default_branch')) {
                this.rootIdentifier = this.repoData['default_branch'];
            } else if (this.repoData.hasOwnProperty('master_branch')) {
                this.rootIdentifier = this.repoData['master_branch'];
            }
        }

        if (!this.rootIdentifier) {
            this.rootIdentifier = 'master';
        }
    }

    /**
     * Get the next page.
     *
     * @return {String|null}
     */
    getNextPage() {
        let headers = this.rfs.getLastHeaders();

        if (headers['link']) {
            for (let i of Object.keys(headers['link'])) {
                let link = headers['link'][i];
                let match = link.match(/<(.+?)>; *rel="next"/);

                if (match) {
                    return match[1];
                }
            }
        }

        return null;
    }
}
