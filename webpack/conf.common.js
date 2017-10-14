const path = require('path');

const plugins = require('./plugin.common');

module.exports = {
    entry: ['babel-polyfill', './src/index'],
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'js/bundle.js'
    },
    resolve: {
        extensions: ['*', '.js']
    },
    resolveLoader: {
        modules: ['node_modules', __dirname]
    },
    plugins
};

