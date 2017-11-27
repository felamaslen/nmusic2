const webpack = require('webpack');
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassLoader = require('./sass-loader');

const webpackConfig = require('./conf.common');

const { version } = require('../package.json');

const envInjectVars = [
    'WEB_URI'
];

const injectedEnvVars = {
    NODE_ENV: JSON.stringify('production'),

    ...envInjectVars.reduce((vars, name) => {
        vars[name] = JSON.stringify(process.env[name] || '');

        return vars;

    }, {})
};

const ExtractNormalCSS = new ExtractTextPlugin({
    filename: 'css/style.css',
    allChunks: true
});
const ExtractFontsCSS = new ExtractTextPlugin({
    filename: 'css/fonts.css',
    allChunks: true
});

module.exports = () => ({
    ...webpackConfig,
    output: {
        path: path.join(__dirname, '../static'),
        filename: 'js/bundle.js'
    },
    plugins: [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
            'process.env': injectedEnvVars
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                'dead_code': true,
                'drop_debugger': true,
                conditionals: true,
                unused: true,
                'if_return': true
            },
            mangle: {
                toplevel: true
            }
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessorOptions: {
                discardComments: { removeAll: true }
            }
        }),
        ExtractNormalCSS,
        ExtractFontsCSS,
        new HtmlWebpackPlugin({
            version,
            template: 'src/templates/index.ejs'
        })
    ],
    module: {
        ...webpackConfig.module,
        loaders: [
            ...webpackConfig.module.loaders,
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loaders: `strip-loader?${JSON.stringify({ env: ['DEV'] })}!eslint-loader`
            },
            {
                test: /\.scss$/,
                exclude: [/fonts\.scss$/, /node_modules/],
                loaders: ExtractNormalCSS.extract(sassLoader())
            },
            {
                test: /fonts\.scss$/,
                exclude: /node_modules/,
                loaders: ExtractFontsCSS.extract('css-loader!sass-loader')
            }
        ]
    },
    bail: true
});

