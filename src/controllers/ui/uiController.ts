/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AssetManager} from '@app/assets/AssetManager';
import {ConfigManager} from '@app/configs/ConfigManager';
import {Request, Response} from 'express';

/**
 * Redirect to the home page.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function redirectHome(req: Request, res: Response, next: Function): Promise<void> {
    let locale = (await (req.app.get('config-manager') as ConfigManager).get()).get('ui[locale]');
    res.redirect('/admin/' + locale);
}

/**
 * Show the web app page.
 *
 * @param {Request}  req  The request
 * @param {Response} res  The response
 * @param {Function} next The next callback
 *
 * @return {Promise<void>}
 */
export async function showWebApp(req: Request, res: Response, next: Function): Promise<void> {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1 maximum-scale=1, user-scalable=no, minimal-ui">
        <meta name="theme-color" content="#0071ce">
        <meta name="msapplication-TileImage" content="${asset(req, 'assets/images/windows-tile.png')}">
        <meta name="msapplication-TileColor" content="#0071ce">
        <link rel="fluid-icon" type="image/png" href="${asset(req, 'assets/images/fluidicon.png')}" title="Fxp Satis Serverless">
        <link rel="icon" type="image/x-icon" href="${asset(req, 'assets/images/favicon.ico')}">
        <link rel="icon" sizes="192x192" href="${asset(req, 'assets/images/favicon-192.png')}">
        <link rel="icon" sizes="any" href="${asset(req, 'assets/images/badge.svg')}">
        <link rel="apple-touch-icon" sizes="57x57" href="${asset(req, 'assets/images/apple-touch-icon-57.png')}">
        <link rel="apple-touch-icon" sizes="72x72" href="${asset(req, 'assets/images/apple-touch-icon-72.png')}">
        <link rel="apple-touch-icon" sizes="76x76" href="${asset(req, 'assets/images/apple-touch-icon-76.png')}">
        <link rel="apple-touch-icon" sizes="114x144" href="${asset(req, 'assets/images/apple-touch-icon-114.png')}">
        <link rel="apple-touch-icon" sizes="144x144" href="${asset(req, 'assets/images/apple-touch-icon-144.png')}">
        <link rel="apple-touch-icon" sizes="152x152" href="${asset(req, 'assets/images/apple-touch-icon-152.png')}">
        <link rel="apple-touch-icon" sizes="180x180" href="${asset(req, 'assets/images/apple-touch-icon-180.png')}">
        <link type="text/css" rel="stylesheet" href="${asset(req, 'assets/main.css')}">
    </head>
    <body>
        <div id="app">
        </div>
        <script src="${asset(req, 'assets/main.js')}"></script>
    </body>
</html>
`);
}

/**
 * Get the real asset file.
 *
 * @param {Request} req
 * @param {string}  file
 *
 * @return {string}
 */
function asset(req: Request, file: string): string {
    return (req.app.get('asset-manager') as AssetManager).get(file);
}
