const path = require('path');

const plugins = require('./plugin.common');

module.exports = {
    entry: ['./src/index'],
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'js/bundle.js'
    },
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../src/images/sprite')],
        extensions: ['*', '.js', '.json']
    },
    resolveLoader: {
        modules: ['node_modules', __dirname]
    },
    node: {
        fs: 'empty'
    },
    plugins
};

