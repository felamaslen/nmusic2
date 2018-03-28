const { getInfoFilterQuery } = require('../helpers');

function routeSongsList(config, db) {
    return function *getSongsList(req, res) {
        const query = ['artist', 'album'].reduce((filter, item) => {
            if (req.query[item]) {
                if (!filter.$and) {
                    filter.$and = [];
                }

                filter.$and.push(getInfoFilterQuery(req.query[item], item));
            }

            return filter;
        }, {});

        const results = yield db.collection(config.collections.music)
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
    };
}

module.exports = {
    routeSongsList
};

