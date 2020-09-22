const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const { merge } = require('webpack-merge');
const ExtensionReloader = require('webpack-extension-reloader');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto')

const result = dotenv.config();

if (result.error) {
    throw result.error;
}

console.log(result.parsed)

const styleNonce = crypto.randomBytes(8).toString('base64');

const processManifest = (newCSPRules, newPermissions) => {
    const manifestStr = fs.readFileSync('./src/manifest.json');
    const manifestJSON = JSON.parse(manifestStr);

    let csp = manifestJSON['content_security_policy'];
    newCSPRules.forEach(cspRule => {
        const { tag, rules } = cspRule;
        const rulesStr = rules.join(" ");
        const scriptSrcIndex = csp.indexOf(tag) + tag.length;
        csp = csp.slice(0, scriptSrcIndex) + (" " + rulesStr) + csp.slice(scriptSrcIndex);
    });
    manifestJSON['content_security_policy'] = csp;

    const permissions = manifestJSON['permissions'];
    newPermissions.forEach(permission => {
        permissions.push(permission);
    });
    manifestJSON['permissions'] = permissions;

    return JSON.stringify(manifestJSON);
}

const commonConfig = {
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
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
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
                                nonce: styleNonce,
                            },
                        },
                    },
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new Dotenv(),
        new CleanWebpackPlugin(),
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
            ]
        })
    ],
    optimization: {
        minimize: true,
    },
    stats: 'minimal',
};

const developmentConfig = (devManifestStr) => {
    return {
        plugins: [
            new ExtensionReloader({
                entries: {
                    contentScript: '',
                    background: '',
                }
            }),
            new CreateFileWebpack({
                path: commonConfig.output.path,
                fileName: 'manifest.json',
                content: devManifestStr
            })
        ],
        mode: 'development'
    }
}

const productionConfig = (prodManifestStr) => {
    return {
        plugins: [
            new CreateFileWebpack({
                path: commonConfig.output.path,
                fileName: 'manifest.json',
                content: prodManifestStr
            })
        ],
        mode: 'production'
    }
}

module.exports = env => {
    switch (env) {
        case 'development':
            const devManifestStr = processManifest(
                [
                    {
                        tag: "style-src",
                        rules: [`'nonce-${styleNonce}'`]
                    },
                    {
                        tag: "script-src",
                        rules: ["'unsafe-eval'"]
                    }, {
                        tag: "connect-src",
                        rules: ["ws://localhost:*", "http://localhost:*"]
                    }
                ],
                ["http://localhost:8080/*"]
            );
            return merge(commonConfig, developmentConfig(devManifestStr));
        case 'production':
            const prodManifestStr = processManifest(
                [
                    {
                        tag: "style-src",
                        rules: [`'nonce-${styleNonce}'`]
                    },
                    {
                        tag: "connect-src",
                        rules: [process.env.PRODUCTION_SERVER_URL]
                    }
                ],
                [`${process.env.PRODUCTION_SERVER_URL}/*`]
            );
            return merge(commonConfig, productionConfig(prodManifestStr));
        default:
            throw new Error('No matching configuration was found!');
    }
}
