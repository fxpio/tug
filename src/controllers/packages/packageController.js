/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PackageManager from '../../composer/packages/PackageManager';
import {showError404} from '../../middlewares/errors';

/**
 * Display the package definition for a specific version.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showPackageVersion(req, res, next) {
    /** @type PackageManager manager */
    let manager = req.app.set('package-manager');
    let packageName = req.params.vendor + '/' +req.params.package;
    let version = req.params.version;
    let resPackage = await manager.findPackage(packageName, version);

    if (resPackage) {
        res.json(resPackage);
        return;
    }

    showError404(req, res);
}
