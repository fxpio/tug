/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthBuilder} from '@server/middlewares/auth/builders/AuthBuilder';
import {createHash} from '@server/utils/crypto';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BasicMockAuthBuilder implements AuthBuilder
{
    private readonly username: string;
    private readonly password: string;

    /**
     * Constructor.
     *
     * @param {string} username The username
     * @param {string} password The password
     */
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    /**
     * @inheritDoc
     */
    public async createToken(req: Request): Promise<string|false> {
        return `${createHash(this.username)}:${createHash(this.password)}`;
    }
}
