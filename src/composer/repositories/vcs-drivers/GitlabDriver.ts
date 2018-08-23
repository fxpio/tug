/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Config} from '../../../configs/Config';
import {VcsDriverError} from '../../../errors/VcsDriverError';
import {RemoteFilesystem} from '../../utils/RemoteFilesystem';
import {VcsDriver} from './VcsDriver';
import {TransportError} from "../../../errors/TransportError";
import querystring from 'querystring';
import {LooseObject} from '../../../utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class GitlabDriver extends VcsDriver
{
    private readonly originUrl: string;
    private readonly infoCache: LooseObject;

    private owner: string;
    private repository: string;
    private repoData: LooseObject|null;
    private rootIdentifier: string|null;
    private isPrivate: boolean;
    private hasIssues: boolean;
    private tags: LooseObject|null;
    private branches: LooseObject|null;

    /**
     * Constructor.
     *
     * @param {Object}           repoConfig         The repository config
     * @param {Config}           config             The config
     * @param {RemoteFilesystem} [remoteFilesystem] The remote filesystem
     */
    constructor(repoConfig: LooseObject, config: Config, remoteFilesystem?: RemoteFilesystem) {
        super(repoConfig, config, remoteFilesystem);

        let match: LooseObject|null = this.url.match(/^(?:(?:https?|git):\/\/([^\/]+)\/|git@([^:]+):)([^\/]+)\/(.+?)(?:\.git|\/)?$/);

        if (null === match) {
            throw new VcsDriverError('The url is not a valid url for the Github vcs driver');
        }

        this.owner = match[3];
        this.repository = match[4];
        this.originUrl = undefined !== match[1] ? match[1] : match[2];

        if ('www.gitlab.com' === this.originUrl) {
            this.originUrl = 'gitlab.com';
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
    public static supports(config: Config, url: string, deep: boolean = false): boolean {
        let matches: LooseObject|null = url.match(/^((?:https?|git):\/\/([^\/]+)\/|git@([^:]+):)([^\/]+)\/(.+?)(?:\.git|\/)?$/);

        if (!matches) {
            return false;
        }

        let originUrl = undefined !== matches[2] ? matches[2] : matches[3];

        return config.get('gitlab-domains').includes(originUrl.replace(/^www\./i, ''));
    }

    /**
     * @inheritDoc
     */
    public getUrl(): string {
        return this.url;
    }

    /**
     * Get the api url.
     *
     * @return {String}
     */
    public getApiUrl(): string {
        let apiUrl = `${this.originUrl}/api/v4`;

        return `https://${apiUrl}`;
    }

    /**
     * Generate an ssh url.
     *
     * @return {String}
     */
    public generateSshUrl(): string {
        return `git@${this.originUrl}:${this.owner}/${this.repository}.git`;
    }

    /**
     * @inheritDoc
     */
    public async getRepoData(): Promise<Object|null> {
        await this.fetchRootIdentifier();

        return this.repoData;
    }

    /**
     * @inheritDoc
     */
     public async getRootIdentifier(): Promise<string> {
         await this.fetchRootIdentifier();

         return this.rootIdentifier as string;
     }

    /**
     * @inheritDoc
     */
    public getSource(identifier: string): LooseObject {
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
    public getDist(identifier: string): LooseObject {
        let url = `${this.getApiUrl()}/projects/${querystring.escape(`${this.owner}/${this.repository}`)}/archive`;

        return {
            type: 'tar.gz',
            url: url,
            reference: identifier
        };
    }

    /**
     * @inheritDoc
     */
    public async getComposerInformation(identifier: string): Promise<LooseObject|null> {
        if (!this.infoCache[identifier]) {
            let composer = await this.getBaseComposerInformation(identifier);

            if (composer) {
                // specials for gitlab
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
    public async getFileContent(file: string, identifier: string): Promise<string|null> {
        let content = null;
        let error = null;

        try {
            let resourceFile:string = `${this.getApiUrl()}/projects/${querystring.escape(`${this.owner}/${this.repository}`)}/repository/files/${file}?ref=${encodeURIComponent(identifier)}`;
            let resource = JSON.parse(await this.getContents(resourceFile) as string);

            if (resource['content'] && 'base64' === resource['encoding']) {
                content = Buffer.from(resource['content'], 'base64').toString();
            } else {
                error = new VcsDriverError(`Could not retrieve "${file}" for "${identifier}"`);
            }
        } catch (e) {
            if (e instanceof TransportError) {
                if (404 !== e.statusCode) {
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
    public async getChangeDate(identifier: string): Promise<Date|null> {
        let resourceFile:string = `${this.getApiUrl()}/projects/${querystring.escape(`${this.owner}/${this.repository}`)}/repository/commits/${encodeURIComponent(identifier)}`;
        let commit = JSON.parse(await this.getContents(resourceFile) as string);

        return new Date(commit['committed_date']);
    }

    /**
     * @inheritDoc
     */
    public async getTags(): Promise<LooseObject> {
        if (null === this.tags) {
            this.tags = {};
            let resourceFile: string = `${this.getApiUrl()}/projects/${querystring.escape(`${this.owner}/${this.repository}`)}/repository/tags?per_page=100`;
            let resource = null;

            do {
                let tagsData = JSON.parse(await this.getContents(resourceFile) as string);
                if (tagsData) {
                    for (let tag of tagsData) {
                        this.tags[tag['name']] = tag['commit']['id'];
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
    public async getBranches(): Promise<LooseObject> {
        if (null === this.branches) {
            this.branches = {};
            let resourceFile = `${this.getApiUrl()}/projects/${querystring.escape(`${this.owner}/${this.repository}`)}/repository/branches?per_page=100`;
            let branchBlacklist = ['gh-pages'];
            let resource = null;

            do {
                let branchData = JSON.parse(await this.getContents(resourceFile) as string);
                if (branchData) {
                    for (let branch of branchData) {
                        let name = branch['name'];

                        if (!branchBlacklist.includes(name)) {
                            this.branches[name] = branch['commit']['id'];
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
    public async getContents(url: string, fetchingRepoData: boolean = false): Promise<string|boolean> {
        try {
            return await this.rfs.get(this.originUrl, url, {});
        } catch (e) {
            return false;
        }
    }

    /**
     * Fetch the root identifier.
     */
    private async fetchRootIdentifier(): Promise<void> {
        if (this.repoData) {
            return;
        }

        let repoDataUrl = `${this.getApiUrl()}/projects/${querystring.escape(`${this.owner}/${this.repository}`)}`;
        let contentData = await this.getContents(repoDataUrl, true) as string;

        try {
            this.repoData = JSON.parse(contentData);
        } catch (e) {
            throw new VcsDriverError(`"${repoDataUrl}" does not contain valid JSON` + "\n" + e.message);
        }

        if (this.repoData) {
            this.owner = this.repoData['namespace']['full_path'];
            this.repository = this.repoData['name'];
            this.isPrivate = undefined !== this.repoData['visibility'] && this.repoData['visibility'] == 'private';
            this.hasIssues = undefined !== this.repoData['issues_enabled'] && this.repoData['issues_enabled'];

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
    private getNextPage(): string|null {
        let headers:LooseObject = this.rfs.getLastHeaders();

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
