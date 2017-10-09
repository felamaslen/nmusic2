const { Router } = require('express');
const bodyParser = require('body-parser');

const config = require('../../common/config');
const Database = require('../../common/db');

const { routeSongsList } = require('./songs-list');

async function dbMiddleware(req, res, next) {
    req.db = await Database.dbConnect(config.dbUri);

    next();
}

function apiRoutes() {
    const router = new Router();

    router.use(dbMiddleware);

    router.get('/songs', routeSongsList);

    return router;
}

function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes());
}

module.exports = setup;

