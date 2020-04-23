/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {LooseObject} from '@server/utils/LooseObject';
import {Request} from 'express';

/**
 * Check if the request comes from SQS with API Gateway trigger.
 *
 * @param {Request} req
 *
 * @return {boolean}
 */
export function isSqsRequest(req: LooseObject): boolean {
    if (req.apiGateway && req.apiGateway.event && req.apiGateway.event.Records) {
        const event = req.apiGateway.event;

        for (const record of event.Records) {
            if (isSqsMessage(record)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Check if the message is a SQS message.
 *
 * @param {object} message
 *
 * @return {boolean}
 */
export function isSqsMessage(message: LooseObject): boolean {
    return 'aws:sqs' === message.eventSource
        && message.awsRegion
        && message.eventSourceARN
        && message.messageId
        && message.body;
}

/**
 * Get the bodies of SQS message.
 *
 * @param {Request} request
 *
 * @return {Array<LooseObject>}
 */
export function getSqsMessageBodies(request: LooseObject): LooseObject[] {
    const bodies = [];

    if (request.apiGateway && request.apiGateway.event && request.apiGateway.event.Records) {
        const event = request.apiGateway.event;

        for (const record of event.Records) {
            if (isSqsMessage(record)) {
                let body = record.body;
                try {
                    body = JSON.parse(body);
                } catch (e) {}
                bodies.push(body);
            }
        }
    }

    return bodies;
}
