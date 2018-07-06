/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the request comes from SQS with API Gateway trigger.
 *
 * @param {IncomingMessage} request
 *
 * @return {boolean}
 */
export function isSqsRequest(request) {
    if (request.apiGateway && request.apiGateway.event && request.apiGateway.event.Records) {
        let event = request.apiGateway.event;

        for (let i = 0; i < event.Records.length; ++i) {
            let record = event.Records[i];

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
export function isSqsMessage(message) {
    return 'aws:sqs' === message.eventSource
        && message.awsRegion === process.env.AWS_REGION
        && message.eventSourceARN
        && message.messageId
        && message.body;
}

/**
 * Get the bodies of SQS message.
 *
 * @param {IncomingMessage} request
 *
 * @return {Array}
 */
export function getSqsMessageBodies(request) {
    let bodies = [];

    if (request.apiGateway && request.apiGateway.event && request.apiGateway.event.Records) {
        let event = request.apiGateway.event;

        for (let i = 0; i < event.Records.length; ++i) {
            let record = event.Records[i];

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
