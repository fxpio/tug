/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Joi from 'joi';
import {ValidationError} from '../errors/ValidationError';
import {Request} from 'express';
import {LooseObject} from './LooseObject';

/**
 * Validate the form request.
 *
 * @param {Request}     req        The request
 * @param {LooseObject} schemaKeys The map of request body fields
 *
 * @throws ValidationError When the request form has errors
 */
export function validateForm(req: Request, schemaKeys: LooseObject): void {
    let schema = Joi.object().keys(schemaKeys);
    let valResult = Joi.validate(req.body, schema);

    if (valResult.error) {
        let errorFields:LooseObject = {};
        let details = valResult.error.details;

        for (let error of details) {
            errorFields[error.path.join('.')] = error.message;
        }

        throw new ValidationError(errorFields);
    }
}
