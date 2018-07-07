/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class QueueReceiver
{
    /**
     * Check if the receiver support the message.
     *
     * @param {Object} message The message comes from queue
     *
     * @return {Boolean}
     */
    supports(message) {
        return false;
    }

    /**
     * Execute the receiver.
     *
     * @param {Object} message The message comes from queue
     */
    async execute(message) {
    }

    /**
     * Finish the execution of the receiver.
     */
    async finish() {
    }
}
