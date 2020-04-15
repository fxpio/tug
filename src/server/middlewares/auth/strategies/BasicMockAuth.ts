/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthStrategy} from '@server/middlewares/auth/strategies/AuthStrategy';
import {createHash} from '@server/utils/crypto';
import auth from 'basic-auth';
import {Request} from 'express';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BasicMockAuth implements AuthStrategy {
    private readonly requiredUsername: string;
    private readonly requiredPassword: string;

    /**
     * Constructor.
     *
     * @param {string} requiredUsername The required username
     * @param {string} requiredPassword The required password
     */
    constructor(requiredUsername: string, requiredPassword: string) {
        this.requiredUsername = requiredUsername;
        this.requiredPassword = requiredPassword;
    }

    /**
     * @inheritDoc
     */
    public async logIn(req: Request): Promise<boolean> {
        const user = auth(req);
        let username;
        let password;
        let sessionToken;

        if (user) {
            username = user.name;
            password = user.pass;
        } else if (req.headers.authorization) {
            const auth = req.headers.authorization as string;

            if (auth.startsWith('token ')) {
                const parts = auth.substring(6).split(':');
                username = parts[0];
                password = parts[1];
                sessionToken = parts[2];
            }
        }

        return (username === this.requiredUsername || username === createHash(this.requiredUsername as string))
            && (password === this.requiredPassword || password === createHash(this.requiredPassword as string))
            && !sessionToken;
    }
}
