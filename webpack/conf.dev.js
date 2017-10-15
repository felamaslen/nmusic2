const webpack = require('webpack');

const webpackConfig = require('./conf.common');
const moduleConfigDev = require('./module.dev');

module.exports = {
    ...webpackConfig,
    devtool: 'source-map',
    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://0.0.0.0:${process.env.PORT_WDS}`,
        'webpack/hot/only-dev-server',
        ...webpackConfig.entry
    ],
    plugins: [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    module: moduleConfigDev,
    devServer: {
        stats: {
            colors: true,
            modules: false,
            chunks: false,
            reasons: true
        },
        hot: true,
        quiet: false,
        noInfo: false,
        publicPath: '/',
        port: process.env.PORT_WDS,
        historyApiFallback: true,
        proxy: {
            '/': {
                target: `http://localhost:${process.env.PORT}`,
                secure: false
            }
        }
    }
};

