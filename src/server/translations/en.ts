/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    'validation.field.required': `This field is required`,

    'error.http.unauthorized.basic': `Your credentials are invalid`,
    'error.http.bad-request': `Bad request`,
    'error.http.bad-request.validation': `Validation errors`,
    'error.http.bad-request.invalid-json': `The body of your request is not a valid JSON`,
    'error.http.too-many-requests': `Too many requests`,
    'error.http.not-found': `Resource not found`,
    'error.http.not-found.repository-branch': `Branch "{{name}}" is not found`,
    'error.http.not-found.repository-tag': `Tag "{{name}}" is not found`,
    'error.http.not-found.repository': `The repository with the url "{{url}}" is not found`,
    'error.http.not-supported.repository': `The repository with the url "{{url}}" is not supported`,
    'error.http.internal-server': `Internal server error`,

    'manager.repository.created': `The "{{type}}" repository with the URL "{{url}}" were enabled successfully`,
    'manager.repository.deleted': `The repository with the URL "{{url}}" were disabled successfully`,

    'manager.config.github-oauth.empty': `No tokens for Github Oauth are saved`,
    'manager.config.github-oauth': `The Oauth tokens to connect the server with your Github account are "{{tokens}}"`,
    'manager.config.github-oauth.created': `The Oauth token "{{token}}" to connect the server with your Github account hosted on "{{host}" was created successfully`,
    'manager.config.github-oauth.deleted': `The Oauth token to connect the server with your Github account hosted on "{{host}}" was deleted successfully`,
    'manager.config.github-token.empty': `No tokens for Github Webhooks are generated`,
    'manager.config.github-token': `The tokens for Github Webhooks are "{{tokens}}"`,
    'manager.config.github-token.created': `The token "{{token}}" for Github Webhooks hosted on "{{host}}" was created successfully`,
    'manager.config.github-token.deleted': `The token for Github Webhooks hosted on "{{host}}" was deleted successfully`,

    'manager.api-key.created': `The API key "{{token}" was created successfully`,
    'manager.api-key.deleted': `The API key "{{token}}" was deleted successfully`,

    'manager.package.refresh.versions.all-repositories': `Refreshing all package versions has started for all repositories`,
    'manager.package.refresh.versions': `Refreshing all package versions has started for the repository "{{url}}"`,
    'manager.package.refresh.version': `Refreshing package version "{{version}}" has started for the repository "{{url}}"`,
    'manager.package.delete.versions': `Deleting of all packages has started for the repository "{{url}}"`,
    'manager.package.delete.version': `Deleting of package version "{{version}}" has started for the repository "{{url}}"`,
    'manager.package.refresh.cache.versions': `Refreshing cache of all package versions has started for all packages`,
    'manager.package.refresh.cache.version': `Refreshing cache of all package versions has started for the package "{{packageName}}"`,
};
