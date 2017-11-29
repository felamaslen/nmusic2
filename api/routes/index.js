import { Router } from 'express';
import bodyParser from 'body-parser';
import sendSeekable from 'send-seekable';

import config from '../../common/config';
import Database from '../../common/db';
import { generatorToPromise as asyncGen } from '../helpers/effects';

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

    router.get('/songs', asyncGen(routeSongsList));
    router.get('/artists', asyncGen(routeFilterList('artist')));
    router.get('/albums/:artist?', asyncGen(routeFilterList('album', 'artist')));
    router.get('/search/:keyword', asyncGen(routeSearch));

    router.get('/play/random', asyncGen(routePlayRandom));
    router.get('/play/:id', sendSeekable, asyncGen(routePlay));

    router.get('/artwork/:encoded', asyncGen(routeArtwork));

    router.patch('/edit/:id', asyncGen(routeEdit));

    router.use((req, res, next) => {
        if (req.dbInit) {
            return req.db.close();
        }

        return next();
    });

    return router;
}

export default function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes());
}

