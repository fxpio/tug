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
const fs = require('fs-extra');

program
    .description('Encode the AWS API Gateway headers for queue')
    .option('-e, --event [file]', 'The filename of the sqs header event', './test/fixtures/sqs-header-event.json')
    .parse(process.argv)
;

console.info('');
console.info('HTTP HEADER "x-apigateway-event":');
console.info('');
console.info(encodeURIComponent(JSON.stringify(fs.readJSONSync(program.event))));

console.info('');
console.info('HTTP HEADER "x-apigateway-context":');
console.info('');
console.info(encodeURIComponent(JSON.stringify(fs.readJSONSync('./test/fixtures/sqs-header-context.json'))));
