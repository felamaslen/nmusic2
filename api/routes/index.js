const { Router } = require('express');
const bodyParser = require('body-parser');
const sendSeekable = require('send-seekable');
const { routeSongsList } = require('./songs-list');
const { routeFilterList } = require('./filter-list');
const { routeSearch } = require('./search');
const { routePlay, routePlayRandom } = require('./play');
const { routeArtwork } = require('./artwork');
const { routeEdit } = require('./edit');

function apiRoutes(config, db, logger) {
    const router = new Router();

    router.use(sendSeekable);

    router.get('/songs', routeSongsList(config, db, logger));
    router.get('/artists', routeFilterList(config, db, logger, 'artist'));
    router.get('/albums/:artist?', routeFilterList(config, db, logger, 'album', 'artist'));
    router.get('/search/:keyword', routeSearch(config, db, logger));

    router.get('/play/random', routePlayRandom(config, db, logger));
    router.get('/play/:id', routePlay(config, db, logger));

    router.get('/artwork/:encoded', routeArtwork(config, db, logger));

    router.patch('/edit', routeEdit(config, db, logger));

    return router;
}

function setupApi(config, db, logger, app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes(config, db, logger));
}

module.exports = { setupApi };

