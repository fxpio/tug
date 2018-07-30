/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');
const argv = require('yargs').argv;
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
require('webpack');

const prod = 'production' === process.env.NODE_ENV || argv._.includes('production') || argv.production;
const mode = prod ? 'production' : 'development';
const isDevServer = process.argv[1].indexOf('webpack-dev-server') >= 0;
const serverPort = parseInt(process.env.SERVER_PORT || 3000) + 2;
const publicPath = 'assets/';
const publicFullPath = isDevServer ? 'http://localhost:' + serverPort + '/' + publicPath : undefined;

module.exports = {
    mode: mode,
    stats: 'errors-only',
    devtool: prod ? false : 'source-map',

    performance: {
        hints: false
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    devServer: {
        port: serverPort,
        compress: true,
        overlay: true,
        stats: 'errors-only'
    },

    plugins: [
        new CopyWebpackPlugin([
            {   from: path.resolve(__dirname, 'src/ui/assets'),
                to: 'images/[path][name].[hash:8].[ext]',
                test: /.(webp|jpg|jpeg|png|gif|svg|ico)$/,
                toType: 'template'
            }
        ], {
            copyUnmodified: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash:8].css",
            chunkFilename: "[id].css"
        }),
        new ManifestPlugin({
            writeToFileEmit: true,
            basePath: publicPath,
            publicPath: publicFullPath,
            map: (file) => {
                file.name = file.name.replace(/(\.[a-f0-9]{8})(\..*)$/, '$2');

                return file;
            }
        })
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js'
        }
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'ts-loader' },
            { test: /\.(sa|sc|c)ss$/, loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
            { test: /\.styl$/, loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'] },
            { test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/, loader: 'file-loader', options: {name: 'images/[name].[hash:8].[ext]', publicPath: publicFullPath}},
            { test: /\.(woff|woff2|ttf|eot|otf)$/,loader: 'file-loader', options: {name: 'fonts/[name].[hash:8].[ext]', publicPath: publicFullPath} },
            { test: /\.html$/, loader: 'vue-template-loader', options: {transformToRequire: {img: 'src'}} }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'dist/' + publicPath),
        publicPath: '/' + publicPath,
        filename: '[name].[hash:8].js'
    },

    entry: [
        path.resolve(__dirname, 'src/ui/entry-client.ts')
    ]
};
