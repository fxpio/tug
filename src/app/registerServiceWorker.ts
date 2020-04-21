/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* tslint:disable:no-console */
import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
import {register} from 'register-service-worker';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log('App is being served from cache by a service worker.');
        },
        registered() {
            console.log('Service worker has been registered.');
        },
        cached() {
            console.log('Content has been cached for offline use.');
        },
        updatefound() {
            console.log('New content is downloading.');
        },
        updated() {
            console.log('New content is available; please refresh.');
            const message = (new SnackbarMessage('sw.app.updated'))
                .setTranslatable(true)
                .setCloseButton(true)
                .setMultiLine(true)
                .setTimeout(0)
                .setColor('info');

            self.dispatchEvent(new MessageEvent('snackbar-push-snack', {
                data: message,
                origin: window.location.origin,
            }));
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.');
        },
        error(error: Error) {
            console.error('Error during service worker registration:', error);
        },
    });
}
