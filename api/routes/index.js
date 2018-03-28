const express = require('express');
const expressGenerators = require('../modules/wrap-generators');
const sendSeekable = require('send-seekable');
const { routeSongsList } = require('./songs-list');
const { routeFilterList } = require('./filter-list');
const { routeSearch } = require('./search');
const { routePlay, routePlayRandom } = require('./play');
const { routeArtwork } = require('./artwork');
const { routeEdit } = require('./edit');

function setupRoutes(config, db, logger, app) {
    const router = new (expressGenerators(express).Router)();

    router.use(sendSeekable);

    router.get('/songs', routeSongsList(config, db, logger));

    router.get('/artists', routeFilterList(config, db, logger, 'artist'));
    router.get('/albums/:artist?', routeFilterList(config, db, logger, 'album', 'artist'));
    router.get('/search/:keyword', routeSearch(config, db, logger));

    router.get('/play/random', routePlayRandom(config, db, logger));
    router.get('/play/:id', routePlay(config, db, logger));

    router.get('/artwork/:encoded', routeArtwork(config, db, logger));

    router.patch('/edit', routeEdit(config, db, logger));

    app.use(`/api/v${config.apiVersion}`, router);
}

module.exports = { setupRoutes };

