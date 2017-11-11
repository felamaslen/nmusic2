/* eslint no-unused-vars: 0 */
/**
 * Returns webpack configuration objects
 */

const dotenv = require('dotenv');

if (process.env.DOTENV_INJECT === 'true' || process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractNormalCSS = new ExtractTextPlugin({
    filename: 'css/style.css',
    allChunks: true
});
const ExtractFontsCSS = new ExtractTextPlugin({
    filename: 'css/fonts.css',
    allChunks: true
});

const webpackConfigDevelopment = require('./webpack/conf.dev');
const webpackConfigProduction = require('./webpack/conf.prod');

function webpackConfig() {
    if (process.env.NODE_ENV === 'production') {
        return webpackConfigProduction(ExtractNormalCSS, ExtractFontsCSS);
    }

    return webpackConfigDevelopment();
}

module.exports = () => webpackConfig();

