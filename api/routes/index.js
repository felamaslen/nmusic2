const { Router } = require('express');
const bodyParser = require('body-parser');
const sendSeekable = require('send-seekable');

const config = require('../../common/config');
const Database = require('../../common/db');

const { routeSongsList } = require('./songs-list');
const { routePlay } = require('./play');
const { routeArtwork } = require('./artwork');

async function dbMiddleware(req, res, next) {
    req.db = await Database.dbConnect(config.dbUri);

    next();
}

function apiRoutes() {
    const router = new Router();

    router.use(dbMiddleware);
    router.use(sendSeekable);

    router.get('/songs', routeSongsList);
    router.get('/play/:id', routePlay);
    router.get('/artwork/:encoded', routeArtwork);

    return router;
}

function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes());
}

module.exports = setup;

