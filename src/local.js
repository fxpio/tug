/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dotenv from 'dotenv';
dotenv.config();
import app from './app';

const port = process.env.SERVER_PORT || 3000;

app.listen(port);
console.info(`Listening on http://localhost:${port}`);
