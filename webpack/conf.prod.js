const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackConfig = require('./conf.common');
const moduleConfigProd = require('./module.prod');

const envInjectVars = [
];

const injectedEnvVars = {
    NODE_ENV: JSON.stringify('production'),

    ...envInjectVars.reduce((vars, name) => {
        vars[name] = JSON.stringify(process.env[name] || '');

        return vars;

    }, {})
}

module.exports = {
    ...webpackConfig,
    devtool: 'cheap-module-source-map',
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
        })
    ],
    module: moduleConfigProd,
    bail: true
};

