const { Router } = require('express');
const bodyParser = require('body-parser');

const config = require('../../common/config');
const Database = require('../../common/db');

async function dbMiddleware(req, res, next) {
    req.db = await Database.dbConnect(config.dbUri);

    next();
}

function apiRoutes() {
    const router = new Router();

    router.use(dbMiddleware);

    router.get('/songs', async (req, res) => {
        try {
            const results = await req.db
                .collection(config.collections.music)
                .find({})
                .toArray();

            const songList = results
                .map(result => [
                    result._id,
                    result.info.title,
                    result.info.artist,
                    result.info.album,
                    result.info.year,
                    Math.round(result.info.duration)
                ]);

            res.json(songList);
        }
        catch (err) {
            res
                .status(500)
                .json({ status: 'Database error' });
        }
        finally {
            req.db.close();
        }
    });

    router.get('/', (req, res) => {
        res
            .status(400)
            .json({
                error: true,
                status: 'API not implemented!'
            });
    });

    return router;
}

function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${config.apiVersion}`, apiRoutes());
}

module.exports = setup;

