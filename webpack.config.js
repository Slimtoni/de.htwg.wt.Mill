"use strict";

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    plugins: [
        new VueLoaderPlugin()
    ],
    cache: true,
    bail: true,
    stats: 'minimal',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                // Exclude transpiling `node_modules`, except `bootstrap-vue/src`
                exclude: /node_modules\/(?!bootstrap-vue\/src\/)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    externals: {
        // The below allows Typescript to `import Vue from 'vue'` without including Vue in the bundle.
        vue: 'Vue'
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            // Alias for using source of BootstrapVue
            vue$: 'vue/dist/vue.runtime.esm.js'
        }
    },
    performance: {
        hints: 'error',
        maxAssetSize: 15000000,
        maxEntrypointSize: 15000000,
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    devtool: ''
};

// If the arguments includes `-p`, it means we are doing the production build.
if (process.argv.includes('-p')) {
    console.log('Webpack for production');
    module.exports.devtool = '';
    module.exports.performance.maxAssetSize = 250000;
    module.exports.performance.maxEntrypointSize = 250000;
    module.exports.optimization = (module.exports.optimization || {});
    module.exports.optimization.minimizer = (module.exports.optimization.minimizer || []).concat([
        new TerserPlugin({
            sourceMap: false,
            cache: true,
            parallel: true
        }),
    ])
} else {
    console.log('Webpack for development')
}