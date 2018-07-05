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
     * @param {Array<Object>} messages The messages comes from queue
     *
     * @return {Boolean}
     */
    supports(messages) {
        return false;
    }

    /**
     *
     * @param {Array<Object>} messages The messages comes from queue
     */
    execute(messages) {
    }
}
