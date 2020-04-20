<!--
This file is part of the Fxp Satis Serverless package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-snackbar v-model="show"
                bottom
                right
                :multi-line="multiLine"
                :timeout="timeout"
                :color="color">
        <span>{{ message }}</span>

        <v-btn v-if="showCloseButton"
               text
               dark
               ripple
               @click.native="show = false">
      <span v-if="items.length > 0">
        {{ $t('next.count', {count: items.length}) }}
      </span>

            <span v-else>
        {{ $t('close') }}
      </span>
        </v-btn>
    </v-snackbar>
</template>

<script lang="ts">
    import {SnackbarMessage} from '@app/snackbars/SnackbarMessage';
    import {Component, Vue, Watch} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class Snackbar extends Vue {
        public show: boolean = false;

        public items: SnackbarMessage[] = [];

        public color: string | null = null;

        public message: string = '';

        public showCloseButton: boolean = true;

        public timeout: number = 6000;

        public multiLine: boolean = false;

        public mounted(): void {
            window.addEventListener('snackbar-push-snack', this.onReceiveMessage);
        }

        public beforeDestroy(): void {
            this.reset();
        }

        public destroyed(): void {
            window.removeEventListener('snackbar-push-snack', this.onReceiveMessage);
        }

        @Watch('show')
        public async watchShow(show: boolean): Promise<void> {
            if (show) {
                const item = this.items.shift();

                if (item) {
                    this.message = item.isTranslatable() ? this.$t(item.getMessage()) as string : item.getMessage();
                    this.color = item.getColor();
                    this.showCloseButton = item.getCloseButton();
                    this.timeout = item.getTimeout();
                    this.multiLine = item.isMultiline();
                } else {
                    this.show = false;
                }
            } else {
                await (new Promise((res) => setTimeout(res, 400)));

                if (this.items.length > 0) {
                    this.show = true;
                } else {
                    this.reset();
                }
            }
        }

        public reset(): void {
            this.items = [];
            this.color = null;
            this.message = '';
            this.showCloseButton = true;
            this.timeout = 6000;
            this.multiLine = false;
        }

        private onReceiveMessage(event: Event): void {
            if (event instanceof MessageEvent && event.data instanceof SnackbarMessage) {
                const message = event.data;
                this.items.push(message);

                if (!this.show) {
                    this.show = true;
                }
            }
        }
    }
</script>
