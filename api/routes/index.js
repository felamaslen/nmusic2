import { Router } from 'express';
import bodyParser from 'body-parser';
import sendSeekable from 'send-seekable';

import config from '../../common/config';
import Database from '../../common/db';

import routeSongsList from './songs-list';
import routeFilterList from './filter-list';
import routeSearch from './search';
import { routePlay, routePlayRandom } from './play';
import routeArtwork from './artwork';
import routeEdit from './edit';

async function dbMiddleware(req, res, next) {
    req.db = await Database.dbConnect(config.dbUri);

    next();
}

function apiRoutes() {
    const router = new Router();

    router.use(dbMiddleware);

    router.get('/songs', routeSongsList);
    router.get('/artists', routeFilterList('artist'));
    router.get('/albums/:artist?', routeFilterList('album', 'artist'));
    router.get('/search/:keyword', routeSearch);

    router.get('/play/random', routePlayRandom);
    router.get('/play/:id', sendSeekable, routePlay);

    router.get('/artwork/:encoded', routeArtwork);

    router.patch('/edit/:id', routeEdit);

    router.use(req => {
        req.db.close();
    });

    return router;
}

export default function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes());
}

