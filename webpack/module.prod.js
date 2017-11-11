const sassLoader = require('./sassLoader');

const moduleConfig = require('./module.common');

module.exports = (ExtractNormalCSS, ExtractFontsCSS) => {
    return ({
        ...moduleConfig,
        loaders: [
            ...moduleConfig.loaders,
            {
                test: /\.scss$/,
                exclude: [/fonts\.scss$/, /node_modules/],
                loaders: ExtractNormalCSS.extract(sassLoader)
            },
            {
                test: /fonts\.scss$/,
                exclude: /node_modules/,
                loaders: ExtractFontsCSS.extract('css-loader!sass-loader')
            }
        ]
    });
}

