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
const entry = !argv.watch ? 'src/lambda.ts' : 'src/local.ts';

module.exports = {
    target: 'node',
    mode: mode,
    stats: 'errors-only',
    devtool: prod ? false : 'eval-source-map',

    node: {
        __dirname: false,
        __filename: false,
    },

    externals: [
        'aws-sdk',
    ],

    plugins: [
        new NodemonPlugin(),
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@app': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/ui/assets'),
            'aws-serverless-express': path.resolve(__dirname, 'node_modules/aws-serverless-express/src')
        }
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'ts-loader' }
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
