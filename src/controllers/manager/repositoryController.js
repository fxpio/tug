/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Enable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function enableRepository(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let repository = req.body.repository;

    let err = validateRepository(repository);
    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    await storage.put('repositories/' + repository);

    res.json({
        message: `The repository "${repository}" were enabled successfully`,
        repository: repository
    });
}

/**
 * Disable the repository.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function disableRepository(req, res, next) {
    /** @type {DataStorage} */
    let storage = req.app.set('storage');
    let repository = req.body.repository;

    let err = validateRepository(repository);
    if (err) {
        res.status(400).json({
            message: err.message
        });
        return;
    }

    await storage.delete('repositories/' + repository);

    res.json({
        message: `The repository "${repository}" were disabled successfully`,
        repository: repository
    });
}

/**
 * Validate the repository.
 *
 * @param {string} repository
 *
 * @return {Error|null}
 */
function validateRepository(repository) {
    let err = null;

    if (!repository) {
        err = new Error('The "repository" body attribute is required');
    } else if (!repository.match(/\//)) {
        err = new Error('The repository name must be formated with "<username-or-organization-name>/<repository-name>"');
    }

    return err;
}
