/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Format the path.
 *
 * @param {string} path The path
 */
export function formatPath(path: string): string {
    let nPath = path.replace(/^\//g, '');

    if (!nPath
            || nPath.startsWith('packages.json')
            || nPath.startsWith('downloads')
            || nPath.startsWith('p/')) {
        nPath = 'admin';
        console.warn(`The path "${path}" is invalid, fallback path "/${nPath}" is used`);
    }

    return '/' + nPath.replace(/\/$/g, '');
}

export function getRedirectAppPath(basePath: string, requestPath: string): string {
    if (requestPath.endsWith(basePath) || requestPath.includes(basePath + '/')) {
        basePath = requestPath.substring(0, requestPath.indexOf(basePath)) + basePath;
    } else if (!basePath.startsWith(requestPath)) {
        basePath = requestPath.replace(/\/$/g, '') + basePath;
    }

    return basePath + '/app';
}
