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
import {dateToRfc3339} from '../../../utils/date';

/**
 * A driver implementation for driver.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class VcsDriver
{
    /**
     * Constructor.
     *
     * @param {Object}           repoConfig         The repository config
     * @param {Config}           config             The config
     * @param {RemoteFilesystem} [remoteFilesystem] The remote filesystem
     */
    constructor(repoConfig, config, remoteFilesystem = null) {
        this.url = repoConfig['url'];
        this.repoConfig = repoConfig;
        this.config = config;
        this.rfs = remoteFilesystem || new RemoteFilesystem(config);
    }

    /**
     * Checks if this driver can handle a given url.
     *
     * @param {Config}  config The config
     * @param {String}  url    URL to validate/check
     * @param {Boolean} [deep] Unless true, only shallow checks (url matching typically) should be done
     *
     * @return {Boolean}
     */
    static supports(config, url, deep = false) {
        return false;
    }

    /**
     * Return the URL of the repository.
     *
     * @return {String}
     */
    getUrl() {
        return '';
    }

    /**
     * Get the data of repository.
     *
     * @return {Promise<Object|null>}
     */
    async getRepoData() {
        return null;
    }

    /**
     * Return the root identifier (trunk, master, default/tip ...).
     *
     * @return {Promise<String>}
     */
    async getRootIdentifier() {
        return '';
    }

    /**
     * Get the source info.
     *
     * @param {String} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Object} With type, url and reference keys
     */
    getSource(identifier) {
        return {};
    }

    /**
     * Get the dist info.
     *
     * @param {String} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Object} With type, url reference and shasum keys
     */
    getDist(identifier) {
        return {};
    }

    /**
     * Return true if the repository has a composer file for a given identifier,
     * false otherwise.
     *
     * @param {String} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Promise<Boolean>} Whether the repository has a composer file for a given identifier
     */
    async hasComposerFile(identifier) {
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
     * @param {String} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Promise<Object|null>} containing all infos from the composer.json file
     */
    async getComposerInformation(identifier) {
        return {};
    }

    /**
     * Return the composer.json file base information.
     *
     * @param {String} identifier Any identifier to a specific branch/tag/commit
     *
     * @return {Promise<Object|null>} containing all infos from the composer.json file
     */
    async getBaseComposerInformation(identifier) {
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
     * @param {String} file       The file
     * @param {String} identifier The identifier
     *
     * @return {Promise<String|null>}
     */
    async getFileContent(file, identifier) {
        return null;
    }

    /**
     * Get the change date for identifier.
     *
     * @param {String} identifier The identifier
     *
     * @return {Promise<Date|null>}
     */
    async getChangeDate(identifier) {
        return null;
    }

    /**
     * Return list of tags in the repository.
     *
     * @return {Promise<Object>} Tag names as keys, identifiers as values
     */
    async getTags() {
        return {};
    }

    /**
     * Get the identifier value of tag.
     *
     * @param {String} name The tag name
     *
     * @return {Promise<String>}
     */
    async getTag(name) {
        let tags = await this.getTags();

        if (undefined !== tags[name]) {
            return tags[name];
        }
        throw new TagNotFoundError(name);
    }

    /**
     * Return list of branches in the repository.
     *
     * @return {Promise<Object>} Branch names as keys, identifiers as values
     */
    async getBranches() {
        return {};
    }

    /**
     * Get the identifier value of branch.
     *
     * @param {String} name The branch name
     *
     * @return {Promise<String>}
     */
    async getBranch(name) {
        let branches = await this.getBranches();

        if (undefined !== branches[name]) {
            return branches[name];
        }
        throw new BranchNotFoundError(name);
    }

    /**
     * Get the contents.
     *
     * @param {String}  url              The url
     * @param {Boolean} fetchingRepoData Check if the repo data must be fetched
     *
     * @return {Promise<String|Boolean>}
     */
    async getContents(url, fetchingRepoData = false) {
        return false;
    }
}
