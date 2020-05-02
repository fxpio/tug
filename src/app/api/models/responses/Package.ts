/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapObject} from '../MapObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface Package extends MapObject {
    'name': string;
    'description': string;
    'version': string;
    'version_normalized': string;
    'type': string;
    'time': string;
    'source': PackageSource;
    'dist': PackageDist;
    'keywords'?: string[];
    'homepage'?: string;
    'readme'?: string;
    'license'?: string|string[];
    'authors'?: PackageAuthor[];
    'support'?: PackageSupport;
    'funding'?: PackageFounding[];
    'require'?: MapObject<string>;
    'require-dev'?: MapObject<string>;
    'conflict'?: MapObject<string>;
    'replace'?: MapObject<string>;
    'provide'?: MapObject<string>;
    'suggest'?: MapObject<string>;
    'autoload'?: MapObject;
    'autoload-dev'?: MapObject;
    'minimum-stability'?: string;
    'prefer-stable'?: boolean;
    'repositories'?: PackageRepository[];
    'config'?: MapObject;
    'scripts'?: MapObject;
    'extra'?: MapObject;
    'bin'?: string[];
    'archive'?: MapObject;
    'abandoned'?: boolean|string;
    'non-feature-branches'?: string[];
}

export interface PackageSource {
    type: string;
    url: string;
    reference: string;
}

export interface PackageDist extends PackageSource {
    shasum: string;
}

export interface PackageAuthor {
    name?: string;
    email?: string;
    homepage?: string;
    role?: string;
}

export interface PackageSupport extends MapObject {
    issues?: string;
    source?: string;
    email?: string;
}

export interface PackageFounding {
    type: string;
    url: string;
}

export interface PackageRepository {
    type: string;
    url: string;
    options?: MapObject;
    package?: Package;
}
