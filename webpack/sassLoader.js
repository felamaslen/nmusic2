const jsonToSassVars = require('./jsonToSassVars');

const sassVariablesObj = require('../src/constants/styles');
const sassVariables = encodeURIComponent(jsonToSassVars(sassVariablesObj));

const cssLoaderOptions = JSON.stringify({
    importLoaders: 1
});

module.exports = `css-loader?${cssLoaderOptions}!postcss-loader!sass-loader!prepend-loader?data=${sassVariables}`;

