const jsonToSassVars = require('./jsonToSassVars');

const sassVariablesObj = require('../src/constants/styles');
const sassVariables = encodeURIComponent(jsonToSassVars(sassVariablesObj));

const sassLoader = `css-loader!sass-loader!prepend-loader?data=${sassVariables}`;

module.exports = sassLoader;

