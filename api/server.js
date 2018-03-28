/* eslint-disable global-require */
const path = require('path');
const http = require('http');
const express = require('express');
const expressGenerators = require('./modules/wrap-generators');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const requestLogger = require('morgan');
const getLogger = require('../common/logger');
const config = require('../common/config');
const { dbConnect } = require('../common/db');
const { setupRoutes } = require('./routes');
const { setupWebSockets } = require('./client-interaction');
const version = require('../package.json').version;

function setupMiddleware(app) {
    app.use(helmet());
    app.use(bodyParser.json());
}

function setupClient(db, logger, app) {
    app.set('views', path.join(__dirname, '../src/templates'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => res.render('index', {
        htmlWebpackPlugin: {
            options: {
                version
            }
        }
    }));

    if (process.env.NODE_ENV === 'development' && process.env.SKIP_CLIENT !== 'true') {
        const conf = require('../webpack.config')();

        const compiler = require('webpack')(conf);

        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: conf.output.publicPath,
            stats: {
                colors: true,
                modules: false,
                chunks: false,
                reasons: false
            },
            hot: true,
            quiet: false,
            noInfo: false
        }));

        app.use(require('webpack-hot-middleware')(compiler, {
            log: console.log
        }));
    }

    app.use(express.static(path.join(__dirname, '../static')));
}

async function init() {
    const app = expressGenerators(express)();
    const logger = getLogger();
    const db = await dbConnect(config.dbUri);

    if (process.env.NODE_ENV === 'development') {
        app.use(requestLogger('dev'));
    }

    setupMiddleware(app);

    setupRoutes(config, db, logger, app);

    setupClient(db, logger, app);

    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
        logger.verbose('Request error:', err.message);

        res.status(500)
            .json({ status: 'Unknown error' });
    });

    const port = process.env.PORT || 3000;
    const server = http.createServer(app);

    setupWebSockets(config, db, logger, server);

    server.listen(port, () => {
        logger.info('Server listening on port', port);
    });
}

module.exports = {
    setupClient,
    init
};

