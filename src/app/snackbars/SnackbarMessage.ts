/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class SnackbarMessage {
    private message: string;

    private translatable: boolean;

    private multiLine: boolean;

    private closeButton: boolean;

    private timeout: number;

    private color: string|null;

    constructor(message: string = '', color: string|null = null) {
        this.message = message;
        this.translatable = false;
        this.multiLine = false;
        this.closeButton = true;
        this.timeout = 6000;
        this.color = color;
    }

    public setMessage(message: string): SnackbarMessage {
        this.message = message;

        return this;
    }

    public getMessage(): string {
        return this.message;
    }

    public setTranslatable(translatable: boolean): SnackbarMessage {
        this.translatable = translatable;

        return this;
    }

    public isTranslatable(): boolean {
        return this.translatable;
    }

    public setMultiLine(multiLine: boolean): SnackbarMessage {
        this.multiLine = multiLine;

        return this;
    }

    public isMultiline(): boolean {
        return this.multiLine;
    }

    public setCloseButton(closeButton: boolean): SnackbarMessage {
        this.closeButton = closeButton;

        return this;
    }

    public getCloseButton(): boolean {
        return this.closeButton;
    }

    public setTimeout(timeout: number): SnackbarMessage {
        this.timeout = timeout;

        return this;
    }

    public getTimeout(): number {
        return this.timeout;
    }

    public setColor(color: string|null): SnackbarMessage {
        this.color = color;

        return this;
    }

    public getColor(): string|null {
        return this.color;
    }
}
