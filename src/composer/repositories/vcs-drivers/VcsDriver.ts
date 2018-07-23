/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Config from '../../../configs/Config';
import RemoteFilesystem from '../../utils/RemoteFilesystem';
import TagNotFoundError from '../../../errors/TagNotFoundError';
import BranchNotFoundError from '../../../errors/BranchNotFoundError';
import {LooseObject} from '../../../utils/LooseObject';
import {dateToRfc3339} from '../../../utils/date';

/**
 * A driver implementation for driver.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsDriver
{
    protected readonly repoConfig: LooseObject;
    protected readonly config: Config;
    protected readonly rfs: RemoteFilesystem;

    protected url: string;

    /**
     * Constructor.
     *
     * @param {LooseObject}      repoConfig         The repository config
     * @param {Config}           config             The config
     * @param {RemoteFilesystem} [remoteFilesystem] The remote filesystem
     */
    constructor(repoConfig: LooseObject, config: Config, remoteFilesystem?: RemoteFilesystem) {
        this.url = repoConfig['url'];
        this.repoConfig = repoConfig;
        this.config = config;
        this.rfs = remoteFilesystem || new RemoteFilesystem(config);
    }

    /**
     * Checks if this driver can handle a given url.
     *
     * @param {Config}  config The config
     * @param {string}  url    URL to validate/check
     * @param {boolean} [deep] Unless true, only shallow checks (url matching typically) should be done
     *
     * @return {boolean}
     */
    public static supports(config: Config, url: string, deep: boolean = false): boolean {
        return false;
    }

    /**
     * Return the URL of the repository.
     *
     * @return {string}
     */
    public getUrl(): string {
        return '';
    }

    /**
     * Get the data of repository.
     *
     * @return {Promise<Object|null>}
     */
    public async getRepoData(): Promise<Object|null> {
        return null;
    }

    /**
     * Return the root identifier (trunk, master, default/tip ...).
     *
     * @return {Promise<string>}
     */
    public async getRootIdentifier(): Promise<string> {
        return '';
    }

    /**
     * Get the source info.
     *
     * @param {string} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {LooseObject} With type, url and reference keys
     */
    public getSource(identifier: string): LooseObject {
        return {};
    }

    /**
     * Get the dist info.
     *
     * @param {string} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {LooseObject} With type, url reference and shasum keys
     */
    public getDist(identifier: string): LooseObject {
        return {};
    }

    /**
     * Return true if the repository has a composer file for a given identifier,
     * false otherwise.
     *
     * @param {string} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Promise<boolean>} Whether the repository has a composer file for a given identifier
     */
    public async hasComposerFile(identifier: string): Promise<boolean> {
        try {
            await this.getComposerInformation(identifier);
            return true;
        } catch (e) {
        }

        return false;
    }

    /**
     * Return the composer.json file information
     *
     * @param {string} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Promise<LooseObject|null>} containing all infos from the composer.json file
     */
    public async getComposerInformation(identifier: string): Promise<LooseObject|null> {
        return {};
    }

    /**
     * Return the composer.json file base information.
     *
     * @param {string} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Promise<LooseObject|null>} containing all infos from the composer.json file
     */
    public async getBaseComposerInformation(identifier: string): Promise<LooseObject|null> {
        let composerFileContent = await this.getFileContent('composer.json', identifier);

        if (!composerFileContent) {
            return null;
        }

        let composer = JSON.parse(composerFileContent);

        if (!composer['time']) {
            let changeDate = await this.getChangeDate(identifier);
            if (changeDate) {
                composer['time'] = dateToRfc3339(changeDate);
            }
        }

        return composer;
    }

    /**
     * Return the content of file or null if the file does not exist.
     *
     * @param {string} file       The file
     * @param {string} identifier The identifier
     *
     * @return {Promise<string|null>}
     */
    public async getFileContent(file: string, identifier: string): Promise<string|null> {
        return null;
    }

    /**
     * Get the change date for identifier.
     *
     * @param {string} identifier The identifier
     *
     * @return {Promise<Date|null>}
     */
    public async getChangeDate(identifier: string): Promise<Date|null> {
        return null;
    }

    /**
     * Return list of tags in the repository.
     *
     * @return {Promise<LooseObject>} Tag names as keys, identifiers as values
     */
    public async getTags(): Promise<LooseObject> {
        return {};
    }

    /**
     * Get the identifier value of tag.
     *
     * @param {string} name The tag name
     *
     * @return {Promise<string>}
     */
    public async getTag(name: string): Promise<string> {
        let tags = await this.getTags();

        if (undefined !== tags[name]) {
            return tags[name];
        }
        throw new TagNotFoundError(name);
    }

    /**
     * Return list of branches in the repository.
     *
     * @return {Promise<LooseObject>} Branch names as keys, identifiers as values
     */
    public async getBranches(): Promise<LooseObject> {
        return {};
    }

    /**
     * Get the identifier value of branch.
     *
     * @param {string} name The branch name
     *
     * @return {Promise<string>}
     */
    public async getBranch(name: string): Promise<string> {
        let branches = await this.getBranches();

        if (undefined !== branches[name]) {
            return branches[name];
        }
        throw new BranchNotFoundError(name);
    }

    /**
     * Get the contents.
     *
     * @param {string}  url              The url
     * @param {boolean} fetchingRepoData Check if the repo data must be fetched
     *
     * @return {Promise<string|boolean>}
     */
    public async getContents(url: string, fetchingRepoData: boolean = false): Promise<string|boolean> {
        return false;
    }
}
