/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {HttpValidationError} from '@server/errors/HttpValidationError';
import {LooseObject} from '@server/utils/LooseObject';
import {Request} from 'express';
import Joi from 'joi';

/**
 * Validate the form request.
 *
 * @param {Request}     req        The request
 * @param {LooseObject} schemaKeys The map of request body fields
 *
 * @throws HttpValidationError When the request form has errors
 */
export function validateForm(req: Request, schemaKeys: LooseObject): void {
    const schema = Joi.object().keys(schemaKeys);
    const valResult = Joi.validate(req.body, schema);

    if (valResult.error) {
        const errorFields: LooseObject = {};
        const details = valResult.error.details;

        for (const error of details) {
            errorFields[error.path.join('.')] = error.message;
        }

        throw new HttpValidationError(errorFields);
    }
}
