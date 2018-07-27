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
declare module '*.html'
{
    import Vue, {ComponentOptions} from 'vue';

    interface WithRender
    {
        <V extends Vue>(options: ComponentOptions<V>): ComponentOptions<V>
        <V extends typeof Vue>(component: V): V
    }

    const withRender: WithRender;

    export default withRender;
}
