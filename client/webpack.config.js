const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = {
    entry: {
        options: './src/options/main.js',
        popup: './src/popup/main.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ]
            },
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|webp|gif|mp4|mov|ogg|webm)(\?.*)?$/i,
                loader: 'file-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            attributes: {
                                nonce: '0492830985',
                            },
                        },
                    },
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new HTMLPlugin({
            chunks: ['options'],
            filename: 'options.html',
            title: 'Options - Slide URL Recognition',
        }),
        new HTMLPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'Popup - Slide URL Recognition',
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/assets', to: './assets' },
                { from: './src/manifest.json', to: './manifest.json' },
            ]
        }),
        new ExtensionReloader({
            manifest: path.resolve(__dirname, './src/manifest.json'),
        })
    ],
    optimization: {
        minimize: true,
    },
    mode: 'production',
    stats: 'minimal',
};