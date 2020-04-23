<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div ref="lavContainer" class="lottie-wrapper" :style="style"></div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import lottie, {AnimationConfigWithData, AnimationItem} from 'lottie-web';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component({
        components: {},
    })
    export default class Lottie extends Vue {
        @Prop({type: String, default: '100%'})
        public width: string;

        @Prop({type: String, default: '100%'})
        public height: string;

        @Prop({type: String})
        public maxWidth: string;

        @Prop({type: String})
        public transform: string;

        @Prop({type: Boolean, default: false})
        public center: boolean;

        @Prop({type: Object, required: true})
        public options: AnimationConfigWithData;

        private animation?: AnimationItem;

        public get style(): object {
            return {
                'width': this.width,
                'height': this.height,
                'max-width': this.maxWidth,
                'overflow': 'hidden',
                'margin': this.center ? '0 auto' : undefined,
            };
        }

        public mounted(): void {
            const defaultParams = {
                container: this.$refs.lavContainer as Element,
                renderer: 'svg',
                loop: false,
                autoplay: true,
            } as AnimationConfigWithData;
            const params = Object.assign({}, defaultParams, this.options);

            this.animation = lottie.loadAnimation(params);
            this.updateTransform();
            this.$emit('lottie-created', this.animation);
        }

        public beforeUpdate(): void {
            this.updateTransform();
        }

        public destroyed(): void {
            if (this.animation) {
                this.animation = undefined;
            }
        }

        private updateTransform(): void {
            if (this.animation && this.transform) {
                const svgs: HTMLCollection = this.$el.getElementsByTagName('svg');
                (svgs[0] as HTMLElement).style.transform = this.transform;
            }
        }
    }
</script>
