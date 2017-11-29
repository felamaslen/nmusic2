const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const sassLoader = require('./sass-loader');

const webpackConfig = require('./conf.common');

module.exports = () => ({
    ...webpackConfig,
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack/hot/only-dev-server',
        'webpack-hot-middleware/client',
        'react-hot-loader/patch',
        ...webpackConfig.entry
    ],
    output: {
        path: '/',
        publicPath: '/',
        filename: 'js/bundle.js'
    },
    plugins: [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new Dotenv({ path: '.env' })
    ],
    module: {
        ...webpackConfig.module,
        loaders: [
            ...webpackConfig.module.loaders,
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loaders: `strip-loader?${JSON.stringify({ env: ['PROD'] })}`
            },
            {
                test: /\.scss$/,
                exclude: [/fonts\.scss$/, /node_modules/],
                loaders: sassLoader()
            },
            {
                test: /fonts\.scss$/,
                exclude: /node_modules/,
                loaders: 'style-loader!css-loader!sass-loader'
            }
        ]
    }
});

