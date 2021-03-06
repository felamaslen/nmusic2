const config = require('../../common/config');

const { getInfoFilterQuery } = require('../helpers');

async function routeSongsList(req, res, next) {
    const query = ['artist', 'album'].reduce((filter, item) => {
        if (req.query[item]) {
            if (!filter.$and) {
                filter.$and = [];
            }

            filter.$and.push(getInfoFilterQuery(req.query[item], item));
        }

        return filter;
    }, {});

    try {
        const results = await req.db
            .collection(config.collections.music)
            .find(query)
            .toArray();

        const songList = results
            .map(result => [
                result._id,
                result.info.title,
                result.info.artist,
                result.info.album,
                result.info.year,
                Math.round(result.info.duration),
                result.info.track
            ]);

        res.json(songList);
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Database error' });
    }

    return next();
}

module.exports = {
    routeSongsList
};

