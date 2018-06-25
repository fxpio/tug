/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

require('dotenv').config();
const program = require('commander');
const app = require('./../src/app');
const utils = require('./utils/utils');

program
    .description('Serve the Satis server in local')
    .option('-p, --port [port]', 'The port to listen to run the local server', 3000)
    .parse(process.argv)
;

utils.exec('node bin/config -e', [], function () {
    app.listen(program.port);
    console.log(`Listening on http://localhost:${program.port}`);
});
