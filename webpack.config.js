/* eslint no-unused-vars: 0 */
/**
 * Returns webpack configuration objects
 */

const dotenv = require('dotenv');

if (process.env.DOTENV_INJECT === 'true' || process.env.NODE_ENV !== 'production') {
    dotenv.config();
}


const webpackConfigDevelopment = require('./webpack/conf.dev');
const webpackConfigProduction = require('./webpack/conf.prod');

function webpackConfig() {
    if (process.env.NODE_ENV === 'production') {
        return webpackConfigProduction();
    }

    return webpackConfigDevelopment();
}

module.exports = () => webpackConfig();

