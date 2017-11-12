const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = require('./conf.common');
const moduleConfigProd = require('./module.prod');

const { version } = require('../package.json');

const envInjectVars = [
    'WEB_URI',
    'SKIP_VISUALISER'
];

const injectedEnvVars = {
    NODE_ENV: JSON.stringify('production'),

    ...envInjectVars.reduce((vars, name) => {
        vars[name] = JSON.stringify(process.env[name] || '');

        return vars;

    }, {})
}

module.exports = (...args) => ({
    ...webpackConfig,
    plugins: [
        ...webpackConfig.plugins(...args),
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
        new HtmlWebpackPlugin({
            version,
            analytics: injectedEnvVars.NO_ANALYTICS !== 'true',
            externalStyles: true,
            inject: false,
            template: 'src/templates/index.ejs'
        })
    ],
    module: moduleConfigProd(...args),
    bail: true
});

