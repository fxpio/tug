/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const argv = require('yargs').argv;
require('webpack');

const prod = 'production' === process.env.NODE_ENV || argv._.includes('production') || argv.production;
const mode = prod ? 'production' : 'development';
const entry = !argv.watch ? 'src/lambda.js' : 'src/local.js';

module.exports = {
    target: 'node',
    mode: mode,
    stats: 'errors-only',
    devtool: prod ? false : 'eval-source-map',

    externals: [
        'aws-sdk',
    ],

    plugins: [
        new NodemonPlugin(),
    ],

    resolve: {
        alias: {
            'aws-serverless-express': path.resolve(__dirname, 'node_modules/aws-serverless-express/src')
        }
    },

    devServer: {
        compress: true,
        stats: 'errors-only'
    },

    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'server.js',
        library: 'handler',
        libraryTarget: 'umd'
    },

    entry: [
        path.resolve(__dirname, entry)
    ]
};
