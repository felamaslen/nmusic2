const dotenv = require('dotenv');
if (process.env.DOTENV_INJECT === 'true' || process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { init } = require('./server');

init();

