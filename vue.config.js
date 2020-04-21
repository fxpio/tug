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
const webpack = require('webpack');

const isProd = 'production' === process.VUE_CLI_SERVICE.mode;
const isDevServer = !isProd && process.argv[2] && 'serve' === process.argv[2];
const serverApiPort = parseInt(process.env.SERVER_PORT || 3000);
const serverPort = serverApiPort + 2;
const srcPath = path.resolve(__dirname, 'src/app');
const distPath = path.resolve(__dirname, 'dist');
const basePath = 'admin';
const appName = 'Fxp Satis Serverless';
const version = require("./package.json").version;

const webpackPlugin = [
    new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(version),
        VUE_APP_API_URL: isDevServer ? JSON.stringify(`http://localhost:${serverApiPort}`) : undefined,
    }),
];

module.exports = {
    devServer: {
        disableHostCheck: true,
        host: 'localhost',
        port: serverPort,
        compress: true,
        overlay: true,
        stats: 'errors-only',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        before: function() {
            if (isDevServer) {
                fs.ensureDirSync(distPath);
                fs.writeJsonSync(path.resolve(distPath, 'remote-assets-config.json'), {
                    assetBaseUrl: `http://localhost:${serverPort}/${basePath}`,
                });
            }
        },
    },

    css: {
        sourceMap: true,
    },

    pwa: {
        name: appName,
        appleMobileWebAppCapable: 'yes',
        themeColor: '#fafafa',
        msTileColor: '#fafafa',
        manifestOptions: {
            start_url: './index.html',
            background_color: '#fafafa',
        },
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            cleanupOutdatedCaches: true,
            importWorkboxFrom: 'cdn',
            exclude: [
                /\.map$/,
                'robots.txt',
            ],
            navigateFallback: `/${basePath}/index.html`,
        },
    },

    configureWebpack: {
        stats: 'errors-only',
        devtool: isProd ? false : 'eval-source-map',

        performance: {
            hints: false
        },

        plugins: webpackPlugin,
        resolve: {
            alias: {
                '@app': srcPath,
            },
        },
    },

    'chainWebpack': config => {
        config.plugin('fork-ts-checker').tap(args => {
            args[0].tsconfig = './tsconfig.app.json';
            return args;
        });

        if (isProd) {
            config.plugins.delete('friendly-errors');
        }
    },

    publicPath: `/${basePath}/`,
    outputDir: `${distPath}/${basePath}`,
    productionSourceMap: false,
    lintOnSave: 'production' !== process.env.NODE_ENV,

    pages: {
        app: {
            entry: 'src/app/main.ts',
            filename: 'index.html',
            title: appName,
        },
    },
};
