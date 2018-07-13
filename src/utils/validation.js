/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import ValidationError from '../errors/ValidationError';

/**
 * Validate the form request.
 *
 * @param {IncomingMessage}     req        The request
 * @param {Object<String, Joi>} schemaKeys The map of request body fields
 */
export function validateForm(req, schemaKeys) {
    let schema = Joi.object().keys(schemaKeys);
    let valResult = Joi.validate(req.body, schema);

    if (valResult.error) {
        let errorFields = {};
        let details = valResult.error.details;

        for (let error of details) {
            errorFields[error.path.join('.')] = error.message;
        }

        throw new ValidationError(errorFields);
    }
}
