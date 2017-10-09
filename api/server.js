const path = require('path');
const express = require('express');
const requestLogger = require('morgan');

const logger = require('../common/logger');
const setupApi = require('./routes');
const version = require('../package.json').version;

function setupClient(app) {
    app.set('views', path.join(__dirname, '../src/templates'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => res.render('index', { version }));
    app.use(express.static(path.join(__dirname, '../build')));
}

function init() {
    const app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(requestLogger('dev'));
    }

    setupApi(app);
    setupClient(app);

    app.use((req, res) => {
        res
            .status(404)
            .json({
                error: true,
                status: 'Not found'
            });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        logger('MSG', 'Server listening on port', port);
    });
}

module.exports = {
    setupClient,
    init
};

