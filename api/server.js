/* eslint-disable global-require */

const path = require('path');
const http = require('http');
const express = require('express');
const requestLogger = require('morgan');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');

const logger = require('../common/logger');
const setupApi = require('./routes');
const setupClientInteraction = require('./client-interaction');
const version = require('../package.json').version;

function setupClient(app) {
    app.set('views', path.join(__dirname, '../src/templates'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => res.render('index', {
        htmlWebpackPlugin: {
            options: {
                version
            }
        }
    }));

    if (process.env.NODE_ENV === 'development') {
        const conf = webpackConfig();

        const compiler = webpack(conf);

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

function init() {
    const app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(requestLogger('dev'));
    }

    setupApi(app);
    setupClient(app);

    app.use((req, res) => {
        if (req.db) {
            req.db.close();
        }

        res
            .status(404)
            .json({
                error: true,
                status: 'Not found'
            });
    });

    const port = process.env.PORT || 3000;
    const server = http.createServer(app);

    setupClientInteraction.init(server);

    server.listen(port, () => {
        logger('MSG', 'Server listening on port', port);
    });
}

module.exports = {
    setupClient,
    init
};

