const { Router } = require('express');
const bodyParser = require('body-parser');
const sendSeekable = require('send-seekable');

const config = require('../../common/config');
const Database = require('../../common/db');

const { routeSongsList } = require('./songs-list');
const { routeFilterList } = require('./filter-list');
const { routeSearch } = require('./search');
const { routePlay, routePlayRandom } = require('./play');
const { routeArtwork } = require('./artwork');
const { routeEdit } = require('./edit');

async function dbMiddleware(req, res, next) {
    req.db = await Database.dbConnect(config.dbUri);

    next();
}

function apiRoutes() {
    const router = new Router();

    router.use(dbMiddleware);
    router.use(sendSeekable);

    router.get('/songs', routeSongsList);
    router.get('/artists', routeFilterList('artist'));
    router.get('/albums/:artist?', routeFilterList('album', 'artist'));
    router.get('/search/:keyword', routeSearch);

    router.get('/play/random', routePlayRandom);
    router.get('/play/:id', routePlay);

    router.get('/artwork/:encoded', routeArtwork);

    router.patch('/edit/:id', routeEdit);

    router.use((req, res, next) => {
        if (req.db) {
            req.db.close();
        }

        return next();
    });

    return router;
}

function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes());
}

module.exports = setup;

