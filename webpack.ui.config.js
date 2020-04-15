/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');
const fs = require('fs-extra');
const argv = require('yargs').argv;
const OfflinePlugin = require('offline-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
require('webpack');

const prod = 'production' === process.env.NODE_ENV || argv._.includes('production') || argv.production;
const mode = prod ? 'production' : 'development';
const isDevServer = process.argv[1] && process.argv[1].indexOf('webpack-dev-server') >= 0;
const serverPort = parseInt(process.env.SERVER_PORT || 3000) + 2;
const srcPath = path.resolve(__dirname, 'src/app');
const distPath = path.resolve(__dirname, 'dist');
const basePath = 'admin';
const assetPath = 'assets';
const publicFullPath = isDevServer ? `http://localhost:${serverPort}/` : undefined;

let prodPlugins = [];

if (!isDevServer) {
    prodPlugins = [
        new OfflinePlugin({
            responseStrategy: 'network-first',
            appShell: `/${basePath}`,
            externals: [
                `/${basePath}`
            ]
        })
    ];
}

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
        stats: 'errors-only',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        before: function() {
            if (publicFullPath) {
                fs.ensureDirSync(distPath);
                fs.writeJsonSync(path.resolve(distPath, 'server-config.json'), {assetBaseUrl: publicFullPath});
            }
        }
    },

    plugins: [
        new CopyWebpackPlugin([
            {   from: path.resolve(srcPath, 'assets'),
                to: `${assetPath}/images/[path][name].[hash:8].[ext]`,
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
            fileName: `assets-manifest.json`,
            writeToFileEmit: true,
            basePath: `${basePath}/`,
            publicPath: publicFullPath ? `${publicFullPath}${basePath}/` : undefined,
            map: (file) => {
                file.name = file.name.replace(/(\.[a-f0-9]{8,32})(\..*)$/, '$2');

                return file;
            }
        }),
        new WebpackPwaManifest({
            name: 'Fxp Satis Serverless',
            short_name: 'Fxp Satis',
            description: 'Serverless Composer repository for private PHP packages',
            start_url: `/${basePath}/`,
            filename: `${assetPath}/manifest.[hash:8].json`,
            background_color: '#fafafa',
            icons: [
                {   src: path.resolve('src/app/assets/fluidicon.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: `${assetPath}/images`,
                }
            ]
        })
    ].concat(prodPlugins),

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
        alias: {
            '@app': srcPath,
            '@assets': path.resolve(srcPath, 'assets'),
            'vue$': 'vue/dist/vue.runtime.esm.js'
        }
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'ts-loader' },
            { test: /\.(sa|sc|c)ss$/, loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
            { test: /\.styl$/, loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'] },
            { test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/, loader: 'file-loader', options: {name: `${assetPath}/images/[name].[hash:8].[ext]`} },
            { test: /\.(woff|woff2|ttf|eot|otf)$/,loader: 'file-loader', options: {name: `${assetPath}/fonts/[name].[hash:8].[ext]`} },
            { test: /\.html$/, loader: 'vue-template-loader', options: {transformToRequire: {img: 'src'}} }
        ]
    },

    output: {
        path: path.resolve(distPath, basePath),
        publicPath: `/${basePath}/`,
        filename: '[name].[hash:8].js'
    },

    entry: {
        'assets/main': path.resolve(srcPath, 'entry-client.ts')
    }
};
