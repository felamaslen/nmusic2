/**
 * Returns webpack configuration objects
 */

/* eslint-disable global-require */

const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

function webpackConfig() {
    if (process.env.NODE_ENV === 'production') {
        return require('./webpack/conf.prod');
    }

    return require('./webpack/conf.dev');
}

module.exports = webpackConfig();

